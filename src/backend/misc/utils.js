module.exports = {
  // Check if device data is valid
  deviceDataIsValid: function (device) {
    return (
      "name" in device &&
      device.name !== "" &&
      "description" in device &&
      device.description !== "" &&
      "type" in device &&
      [0, 1, 2, 3, 4, 5, 6, 7].includes(device.type)
    );
  },
};
