const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Create a new booking
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { service, address, date, details } = req.body;

    if (!service || !address || !date) {
      return res.status(400).json({
        message: "Service, address and date are required.",
      });
    }

    const booking = await Booking.create({
      user: req.userId,
      service,
      address,
      date,
      details,
    });

    res.status(201).json({
      message: "Booking created successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);

    res.status(500).json({
      message: "Failed to create booking.",
    });
  }
});

// Get bookings of the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings.",
    });
  }
});

// Cancel a pending booking
router.patch("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending bookings can be cancelled.",
      });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully!",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    res.status(500).json({
      message: "Failed to cancel booking.",
    });
  }
});


module.exports = router;


/* Admin: Get all bookings */
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({ bookings });
    } catch (error) {
      console.error("Admin fetch bookings error:", error);

      return res.status(500).json({
        message: "Failed to fetch all bookings.",
      });
    }
  }
);

/* Admin: Update booking status */
router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid booking status.",
        });
      }

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found.",
        });
      }

      booking.status = status;
      await booking.save();

      return res.status(200).json({
        message: "Booking status updated successfully.",
        booking,
      });
    } catch (error) {
      console.error("Admin update booking error:", error);

      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid booking ID.",
        });
      }

      return res.status(500).json({
        message: "Failed to update booking status.",
      });
    }
  }
);
