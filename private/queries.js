const db = require("../models");
const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

module.exports.queryUserRights = async function queryUserRights(user) {
  try {
    var result = await db.user.findAll({
      where: {
        id: user
      }
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryAllBonusItems = async function queryAllBonusItems(id = false) {
  try {
    if (id) {
      var result = await db.bonusItem.findAll({
        raw: true,
        where: {
          id: id
        }
      })
    } else {
      var result = await db.bonusItem.findAll({
        raw: true,
      })
    }
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryAllBonusesWithStatus = async function queryAllBonusesWithStatus(rider) {
  try {
    var result = await sequelize.query("SELECT * FROM bonusItems bi INNER JOIN bonusLogs bl ON bi.id = bl.bonus_id WHERE iStatus != 0 AND bl.user_id = ?",
      {
        replacements: [rider],
        type: QueryTypes.SELECT
      });
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryAllRiders = async function queryAllRiders(rider = false) {
  try {
    if (rider) {
      var result = await db.user.findAll({
        raw: true,
        where: {
          id: rider
        }
      })
    } else {
      var result = await db.user.findAll({
        raw: true,
      })
    }
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryAllBikes = async function queryAllBikes(rider = false) {
  try {
    if (rider) {
      var result = await db.bike.findAll({
        raw: true,
        where: {
          user_id: rider
        }
      })
    } else {
      var result = await db.bike.findAll({
        raw: true
      })
    }
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryPendingSubmissionCount = async function queryPendingSubmissionCount() {
  try {
    var pendingBonuses = await db.bonusLog.count({
      where: {
        iStatus: 0
      }
    })
    return pendingBonuses;
  } catch (err) {
    throw err;
  }
}

module.exports.queryPendingSubmissions = async function queryPendingSubmissions() {
  try {
    var result = await db.bonusLog.findAll({
      where: {
        iStatus: 0
      }
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryPendingBonusDetail = async function queryPendingBonusDetail(id) {
  try {
    var result = await db.bonusItem.findAll({
      where: {
        id: id
      }
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryPendingRiderInfo = async function queryPendingRiderInfo(rider) {
  try {
    var result = await db.user.findAll({
      where: {
        id: rider
      }
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryPendingBikeInfo = async function queryPendingBikeInfo(rider) {
  try {
    var result = await db.bike.findAll({
      where: {
        user_id: rider
      }
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryHandledSubmissions = async function queryHandledSubmissions(limit) {
  try {   
    var result = await sequelize.query("SELECT bl.*, bi.BonusCode, bi.BonusName, bi.Value, u.FirstName, u.LastName, u.UserName, u.FlagNumber, u.isActive, u.isAdmin FROM bonusLogs bl LEFT JOIN bonusItems bi ON bi.id = bl.bonus_id INNER JOIN users u ON u.id = bl.user_id WHERE bl.iStatus != 0 ORDER BY bl.updatedAt DESC LIMIT ?",
    {
      replacements: [limit],
      type: QueryTypes.SELECT
    });
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryCompletedIDsByRider = async function queryCompletedIDsByRider(rider) {
  try {
    var result = await sequelize.query("SELECT bonus_id FROM bonusLogs WHERE bonus_id IS NOT NULL AND iStatus = 1 AND user_id = ?",
    {
      replacements: [rider],
      type: QueryTypes.SELECT
    });
    var ids = JSON.stringify(result);
    return ids;
  } catch (err) {
    throw err;
  }
}

module.exports.querySubmissionsByRider = async function querySubmissionsByRider(rider) {
  try {
    var result = await sequelize.query("SELECT bl.*, bi.BonusCode, bi.BonusName, bi.Value, u.FirstName, u.LastName, u.UserName, u.FlagNumber, u.isActive, u.isAdmin FROM bonusLogs bl LEFT JOIN bonusItems bi ON bi.id = bl.bonus_id INNER JOIN users u ON u.id = bl.user_id WHERE bl.user_id = ? ORDER BY bl.updatedAt DESC LIMIT 10",
    {
      replacements: [rider],
      type: QueryTypes.SELECT
    });
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryMileageRiddenByRider = async function queryMileageRiddenByRider(rider) {
  try {
    var getStartingMileage = await sequelize.query("SELECT odoValue FROM bonusLogs WHERE odoValue IS NOT NULL AND iStatus = 1 AND user_id = ? ORDER BY createdAt ASC LIMIT 1",
    {
      raw: true,
      replacements: [rider],
      type: QueryTypes.SELECT
    });

    var getMostRecentMileage = await sequelize.query("SELECT odoValue FROM bonusLogs WHERE odoValue IS NOT NULL AND iStatus = 1 AND user_id = ? ORDER BY createdAt DESC LIMIT 1",
    {
      replacements: [rider],
      type: QueryTypes.SELECT
    });
    var mileageRidden = 0;
    if (getMostRecentMileage[0].odoValue - getStartingMileage[0].odoValue > 0) {
      mileageRidden = getMostRecentMileage[0].odoValue - getStartingMileage[0].odoValue;
      return mileageRidden;
    } else {
      return mileageRidden;
    }
  } catch (err) {
    return mileageRidden;
    // throw err;
  }
}

module.exports.queryPointsEarnedByRider = async function queryMileageRiddenByRider(rider) {
  try {
    var getStartingMileage = await sequelize.query("SELECT bl.*, bi.`Value` FROM bonusLogs bl INNER JOIN bonusItems bi ON bi.id = bl.bonus_id WHERE bl.bonus_id IS NOT NULL AND bl.iStatus = 1 AND bl.user_id = ?",
    {
      raw: true,
      replacements: [rider],
      type: QueryTypes.SELECT
    });
    var pointsEarned = 0;
    for (i = 0; i < getStartingMileage.length; i++){
      pointsEarned += getStartingMileage[i].Value;
    }
    return pointsEarned;
  } catch (err) {
    return
    throw err;
  }
}