const { Op } = require('sequelize');
const { Booking } = require('../models');

const checkBookingConflict = async (fieldId, bookingDate, startTime, endTime, excludeBookingId = null) => {
  const whereClause = {
    field_id: fieldId,
    booking_date: bookingDate,
    status: {
      [Op.in]: ['PENDING', 'APPROVED']
    },
    [Op.or]: [
      {
        start_time: { [Op.lt]: endTime },
        end_time: { [Op.gt]: startTime }
      }
    ]
  };

  if (excludeBookingId) {
    whereClause.id = { [Op.ne]: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne({ where: whereClause });
  
  return !!conflictingBooking;
};

module.exports = {
  checkBookingConflict
};
