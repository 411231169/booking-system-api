const { checkBookingConflict } = require('../src/utils/bookingValidator');
const { Booking } = require('../src/models');
const { Op } = require('sequelize');

jest.mock('../src/models', () => {
  return {
    Booking: {
      findOne: jest.fn()
    }
  };
});

describe('Booking Conflict Validation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if conflict exists', async () => {
    // Mocking an existing booking found
    Booking.findOne.mockResolvedValue({ id: 1 });

    const result = await checkBookingConflict(1, '2024-01-01', '08:00', '09:00');

    expect(result).toBe(true);
    expect(Booking.findOne).toHaveBeenCalledWith({
      where: {
        field_id: 1,
        booking_date: '2024-01-01',
        status: { [Op.in]: ['PENDING', 'APPROVED'] },
        [Op.or]: [
          {
            start_time: { [Op.lt]: '09:00' },
            end_time: { [Op.gt]: '08:00' }
          }
        ]
      }
    });
  });

  it('should return false if no conflict exists', async () => {
    // Mocking no existing booking found
    Booking.findOne.mockResolvedValue(null);

    const result = await checkBookingConflict(1, '2024-01-01', '08:00', '09:00');

    expect(result).toBe(false);
  });
});
