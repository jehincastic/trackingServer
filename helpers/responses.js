module.exports = {
  response: (res, data, isError = false) => {
    if (isError) {
      res.json({
        status: 'Failed',
        data: data.message || data,
      });
    } else {
      res.json({
        status: 'Success',
        data,
      });
    }
  },
};
