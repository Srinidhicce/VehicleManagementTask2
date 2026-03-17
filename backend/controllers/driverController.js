const Driver = require("../models/driverModel");
const DeleteCount = require("../models/deleteCountModel");

exports.addDriver = async (req, res) => {
  try {
    const { driverId, driverName, phoneNumber } = req.body;
    const photo = req.file ? req.file.filename : "";
    const driver = await Driver.create({
      driverId,
      driverName,
      phoneNumber,
      photo
    });

    res.json(driver);

  } catch (error) {
    res.status(500).json(error);
  }
};


exports.getDrivers = async (req, res) => {
  const drivers = await Driver.find({ isDeleted: false });
  res.json(drivers);

};

exports.updateDriver = async (req, res) => {
  try {
    const id = req.params.id;
    const driver = await Driver.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(driver);

  } catch (error) {
    res.status(500).json(error);
  }
};



exports.deleteDriver = async (req, res) => {

  try {
    const id = req.params.id;
    await Driver.findByIdAndUpdate(id, { isDeleted: true });
    let counter = await DeleteCount.findOne();

    if (!counter) {
      counter = await DeleteCount.create({ deletedDriversCount: 1 });
    } else {
      counter.deletedDriversCount += 1;
      await counter.save();
    }
    res.json({ message: "Driver deleted" });

  } catch (error) {
    res.status(500).json(error);
  }
};