const express = require('express');
const router = express.Router();
const { Transport, TransportParticipant, User, Order } = require('../models');
const { authenticateToken, authorizeRole } = require('../config/middlewares/authenticateToken');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Get available transports for a route
router.get('/available', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const { 
      sourceLatitude, 
      sourceLongitude, 
      destinationLatitude, 
      destinationLongitude,
      departureDate,
      radius = 5,
      page = 1, 
      limit = 10 
    } = req.query;
    
    if (!sourceLatitude || !sourceLongitude || !destinationLatitude || !destinationLongitude) {
      return res.status(400).json({ message: 'Source and destination coordinates are required' });
    }
    
    // Find available transports within the specified radius of source and destination
    // This is a simplified approach - for production, use a spatial database or more accurate calculation
    const maxLatDiff = parseFloat(radius) / 111.32; // 1 degree lat = 111.32 km
    const maxLonDiffSource = parseFloat(radius) / (111.32 * Math.cos(parseFloat(sourceLatitude) * Math.PI / 180));
    const maxLonDiffDest = parseFloat(radius) / (111.32 * Math.cos(parseFloat(destinationLatitude) * Math.PI / 180));
    
    // Build date filter if provided
    const dateFilter = {};
    if (departureDate) {
      const date = new Date(departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      dateFilter.departureTime = {
        [Op.between]: [date, nextDay]
      };
    }
    
    const transports = await Transport.findAndCountAll({
      where: {
        status: 'available',
        currentParticipants: { [Op.lt]: sequelize.col('maxParticipants') },
        sourceLatitude: { [Op.between]: [parseFloat(sourceLatitude) - maxLatDiff, parseFloat(sourceLatitude) + maxLatDiff] },
        sourceLongitude: { [Op.between]: [parseFloat(sourceLongitude) - maxLonDiffSource, parseFloat(sourceLongitude) + maxLonDiffSource] },
        destinationLatitude: { [Op.between]: [parseFloat(destinationLatitude) - maxLatDiff, parseFloat(destinationLatitude) + maxLatDiff] },
        destinationLongitude: { [Op.between]: [parseFloat(destinationLongitude) - maxLonDiffDest, parseFloat(destinationLongitude) + maxLonDiffDest] },
        ...dateFilter
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['departureTime', 'ASC']],
      include: [
        {
          model: User,
          as: 'initiator',
          attributes: ['id', 'name', 'businessName', 'phone']
        },
        {
          model: TransportParticipant,
          as: 'participants',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'businessName']
            }
          ]
        }
      ]
    });
    
    // Filter out transports that are actually too far
    const filteredTransports = transports.rows.filter(transport => {
      const sourceDistance = calculateDistance(
        parseFloat(sourceLatitude),
        parseFloat(sourceLongitude),
        transport.sourceLatitude,
        transport.sourceLongitude
      );
      
      const destDistance = calculateDistance(
        parseFloat(destinationLatitude),
        parseFloat(destinationLongitude),
        transport.destinationLatitude,
        transport.destinationLongitude
      );
      
      return sourceDistance <= parseFloat(radius) && destDistance <= parseFloat(radius);
    });
    
    res.status(200).json({
      totalItems: filteredTransports.length,
      totalPages: Math.ceil(filteredTransports.length / limit),
      currentPage: parseInt(page),
      transports: filteredTransports
    });
  } catch (error) {
    console.error('Error fetching available transports:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get all transports initiated by the user
router.get('/my-initiated', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {
      initiatorId: req.user.id
    };
    
    if (status) {
      filter.status = status;
    }
    
    const transports = await Transport.findAndCountAll({
      where: filter,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['departureTime', 'ASC']],
      include: [
        {
          model: TransportParticipant,
          as: 'participants',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'businessName', 'phone']
            },
            {
              model: Order,
              as: 'order'
            }
          ]
        }
      ]
    });
    
    res.status(200).json({
      totalItems: transports.count,
      totalPages: Math.ceil(transports.count / limit),
      currentPage: parseInt(page),
      transports: transports.rows
    });
  } catch (error) {
    console.error('Error fetching initiated transports:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get transports where user is a participant
router.get('/my-participations', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    const participations = await TransportParticipant.findAndCountAll({
      where: {
        userId: req.user.id
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      include: [
        {
          model: Transport,
          as: 'transport',
          where: filter,
          include: [
            {
              model: User,
              as: 'initiator',
              attributes: ['id', 'name', 'businessName', 'phone']
            }
          ]
        },
        {
          model: Order,
          as: 'order'
        }
      ]
    });
    
    res.status(200).json({
      totalItems: participations.count,
      totalPages: Math.ceil(participations.count / limit),
      currentPage: parseInt(page),
      participations: participations.rows
    });
  } catch (error) {
    console.error('Error fetching transport participations:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get transport by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const transportId = req.params.id;
    
    const transport = await Transport.findByPk(transportId, {
      include: [
        {
          model: User,
          as: 'initiator',
          attributes: ['id', 'name', 'businessName', 'phone']
        },
        {
          model: TransportParticipant,
          as: 'participants',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'businessName', 'phone']
            },
            {
              model: Order,
              as: 'order'
            }
          ]
        }
      ]
    });
    
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    
    res.status(200).json(transport);
  } catch (error) {
    console.error('Error fetching transport:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Create a new transport (vendors only)
router.post('/', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const {
      name,
      description,
      vehicleType,
      capacity,
      capacityUnit,
      cost,
      sourceLocation,
      sourceLatitude,
      sourceLongitude,
      destinationLocation,
      destinationLatitude,
      destinationLongitude,
      departureTime,
      estimatedArrivalTime,
      maxParticipants,
      driverName,
      driverContact
    } = req.body;
    
    const transport = await Transport.create({
      name,
      description,
      vehicleType,
      capacity,
      capacityUnit: capacityUnit || 'kg',
      cost,
      status: 'available',
      sourceLocation,
      sourceLatitude,
      sourceLongitude,
      destinationLocation,
      destinationLatitude,
      destinationLongitude,
      departureTime: new Date(departureTime),
      estimatedArrivalTime: new Date(estimatedArrivalTime),
      currentCapacityUsed: 0,
      maxParticipants,
      currentParticipants: 1, // Initiator is the first participant
      initiatorId: req.user.id,
      driverName,
      driverContact
    });
    
    // Add initiator as a participant
    await TransportParticipant.create({
      transportId: transport.id,
      userId: req.user.id,
      pickupLocation: sourceLocation,
      pickupLatitude: sourceLatitude,
      pickupLongitude: sourceLongitude,
      dropLocation: destinationLocation,
      dropLatitude: destinationLatitude,
      dropLongitude: destinationLongitude,
      cargoWeight: 0, // Initiator might not have cargo
      costShare: 0, // Initiator might not pay (or pays separately)
      status: 'confirmed'
    });
    
    res.status(201).json({
      message: 'Transport created successfully',
      transportId: transport.id
    });
  } catch (error) {
    console.error('Error creating transport:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Join a transport (vendors only)
router.post('/:id/join', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const transportId = req.params.id;
    const {
      orderId,
      pickupLocation,
      pickupLatitude,
      pickupLongitude,
      dropLocation,
      dropLatitude,
      dropLongitude,
      cargoWeight,
      cargoVolume
    } = req.body;
    
    // Check if transport exists and is available
    const transport = await Transport.findOne({
      where: {
        id: transportId,
        status: 'available',
        currentParticipants: { [Op.lt]: sequelize.col('maxParticipants') }
      }
    });
    
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found or not available' });
    }
    
    // Check if user is already a participant
    const existingParticipation = await TransportParticipant.findOne({
      where: {
        transportId,
        userId: req.user.id
      }
    });
    
    if (existingParticipation) {
      return res.status(400).json({ message: 'You are already a participant in this transport' });
    }
    
    // Check if there's enough capacity
    if (transport.currentCapacityUsed + cargoWeight > transport.capacity) {
      return res.status(400).json({ message: 'Not enough capacity in this transport' });
    }
    
    // Calculate cost share based on cargo weight
    const costShare = (cargoWeight / transport.capacity) * transport.cost;
    
    // Create participation
    const participation = await TransportParticipant.create({
      transportId,
      userId: req.user.id,
      orderId,
      pickupLocation,
      pickupLatitude,
      pickupLongitude,
      dropLocation,
      dropLatitude,
      dropLongitude,
      cargoWeight,
      cargoVolume,
      costShare,
      status: 'pending'
    }, { transaction });
    
    // Update transport
    await transport.update({
      currentParticipants: transport.currentParticipants + 1,
      currentCapacityUsed: transport.currentCapacityUsed + cargoWeight
    }, { transaction });
    
    // If order is provided, update order with transport ID
    if (orderId) {
      const order = await Order.findOne({
        where: {
          id: orderId,
          vendorId: req.user.id
        }
      });
      
      if (order) {
        await order.update({
          transportId
        }, { transaction });
      }
    }
    
    await transaction.commit();
    
    res.status(201).json({
      message: 'Joined transport successfully',
      participationId: participation.id,
      costShare
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error joining transport:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update transport status (initiator only)
router.patch('/:id/status', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const transportId = req.params.id;
    const { status } = req.body;
    
    if (!['available', 'booked', 'in_transit', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const transport = await Transport.findOne({
      where: {
        id: transportId,
        initiatorId: req.user.id
      }
    });
    
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found or you are not the initiator' });
    }
    
    await transport.update({ status });
    
    res.status(200).json({
      message: 'Transport status updated successfully',
      transportId,
      newStatus: status
    });
  } catch (error) {
    console.error('Error updating transport status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Approve/reject participation (initiator only)
router.patch('/:id/participants/:participantId', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const transportId = req.params.id;
    const participantId = req.params.participantId;
    const { status } = req.body;
    
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Check if transport exists and user is initiator
    const transport = await Transport.findOne({
      where: {
        id: transportId,
        initiatorId: req.user.id
      }
    });
    
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found or you are not the initiator' });
    }
    
    // Find participant
    const participant = await TransportParticipant.findOne({
      where: {
        id: participantId,
        transportId
      }
    });
    
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    // Update participant status
    await participant.update({ status });
    
    // If cancelled, update transport capacity and participants
    if (status === 'cancelled') {
      await transport.update({
        currentParticipants: transport.currentParticipants - 1,
        currentCapacityUsed: transport.currentCapacityUsed - participant.cargoWeight
      });
    }
    
    res.status(200).json({
      message: `Participant ${status === 'confirmed' ? 'approved' : 'rejected'} successfully`,
      participantId
    });
  } catch (error) {
    console.error('Error updating participant status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = router; 