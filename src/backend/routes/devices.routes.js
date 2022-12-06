//=======[ Settings, Imports & Data ]==========================================
const express = require("express");
const router = express.Router();
const utils = require("../mysql-connector");
const { deviceDataIsValid } = require("../misc/utils");

// Endpoint for get all the devices
router.get("/", function (req, res, next) {
  utils.query("Select * from Devices", (error, resultsSelect) => {
    if (error) {
      return res.status(500).json(error);
    }

    return res.status(200).json(resultsSelect);
  });
});

// Endpoint for get a specific device
router.get("/:id", function (req, res, next) {
  const { id } = req.params;

  utils.query(
    "Select * from Devices where id = ?",
    [id],
    (error, resultsSelect) => {
      if (error) {
        return res.status(500).json(error);
      }

      if (!resultsSelect.length) {
        return res.status(404).send();
      }

      return res.status(200).json(resultsSelect[0]);
    }
  );
});

// Endpoint for create a device
router.post("/", function (req, res, next) {
  const device = req.body;
  device.state = 0;

  if (!deviceDataIsValid(device)) {
    return res.status(400).send();
  }

  utils.query(
    "Insert into Devices(name, description, state, type) VALUES (?,?,?,?)",
    [device.name, device.description, device.state, device.type],
    (error, resultsInsert) => {
      if (error) {
        return res.status(500).json(error);
      }

      if (!resultsInsert) {
        return res.status(404).send();
      }

      const id = resultsInsert.insertId;

      utils.query(
        "Select * from Devices where id = ?",
        [id],
        (error, resultsSelect) => {
          if (error) {
            return res.status(500).json(error);
          }

          if (!resultsSelect.length) {
            return res.status(404).send();
          }

          return res.status(200).json(resultsSelect[0]);
        }
      );
    }
  );
});

// Endpoint for update a device
router.put("/:id", function (req, res, next) {
  const { id } = req.params;
  const device = {
    id,
    name: req.body.name,
    description: req.body.description,
    state: req.body.state,
    type: req.body.type,
  };

  if (!deviceDataIsValid(device)) {
    return res.status(400).send();
  }

  utils.query(
    "Update Devices SET name = ?, description = ?, state = ?, type = ? where id = ?",
    [device.name, device.description, device.state, device.type, id],
    (error, resultsUpdate) => {
      if (error) {
        return res.status(500).json(error);
      }

      if (!resultsUpdate) {
        return res.status(404).send();
      }

      utils.query(
        "Select * from Devices where id = ?",
        [id],
        (error, resultsSelect) => {
          if (error) {
            return res.status(500).json(error);
          }

          if (!resultsSelect.length) {
            return res.status(404).send();
          }

          return res.status(200).json(resultsSelect[0]);
        }
      );
    }
  );
});

// Endpoint for delete a device
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;

  utils.query(
    "Delete from Devices where id = ?",
    [id],
    (error, resultsDelete) => {
      if (error) {
        return res.status(500).json(error);
      }

      if (!resultsDelete) {
        return res.status(404).send();
      }

      return res.status(200).json(id);
    }
  );
});

module.exports = router;
