const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.post("/", goalController.createGoal);
router.get("/:userId", goalController.getGoalsByUser);
router.put("/:goalId/add", goalController.addProgressToGoal);
router.delete("/:id", goalController.deleteGoal);

module.exports = router;
