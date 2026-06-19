const getPagination = (page, limit) => {
  const limitValue = limit ? parseInt(limit, 10) : 10;
  const pageValue = page ? parseInt(page, 10) : 1;
  const offset = (pageValue - 1) * limitValue;

  return { limit: limitValue, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows } = data;
  const currentPage = page ? parseInt(page, 10) : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    data: rows,
    totalPages,
    currentPage
  };
};

module.exports = {
  getPagination,
  getPagingData
};
