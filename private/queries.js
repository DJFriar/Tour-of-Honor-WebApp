const db = require("../models");
const { Op, QueryTypes } = require("sequelize");
const { sequelize, Sequelize } = require("../models");

module.exports.queryAllCategories = async function queryAllCategories(id) {
  try {
    var result = await db.Category.findAll({
      where: {
        Active: 1
      }
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryAllRestrictions = async function queryAllRestrictions() {
  try {
    var result = await db.Restriction.findAll({
      raw: true
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryTokenValidity = async function queryTokenValidity(id, token) {
  try {
    var result = await sequelize.query("SELECT COUNT(id) AS Valid FROM ResetTokens WHERE user_id = ? AND Token = ?",
    {
      replacements: [id, token],
      type: QueryTypes.SELECT
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryNewRiderValidation = async function queryNewRiderValidation(username) {
  try {
    var result = await sequelize.query("SELECT * FROM Users WHERE UserName = ?",
    {
      replacements: [username],
      type: QueryTypes.SELECT
    })
    return result;
  } catch (err) {
    throw err;
  }
}

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

module.exports.queryUserIDFromFlagNum = async function queryUserIDFromFlagNum(flag) {
  try {
    var result = await db.User.findAll({
      where: {
        FlagNum: {
          [Sequelize.Op.in]: [flag]
        } 
      }
    })
    return result;
  } catch (err) {
    throw err;
  }
}

// module.exports.queryUserIDFromFlagNum = async function queryUserIDFromFlagNum(flag) {
//   try {
//     var result = await sequelize.query("SELECT id FROM Users WHERE FlagNumber = ?",
//     {
//       replacements: [flag],
//       type: QueryTypes.SELECT
//     })
//     return result;
//   } catch (err) {
//     throw err;
//   }
// }

module.exports.queryAllMemorials = async function queryAllMemorials(id = false) {
  try {
    if (id) {
      var result = await sequelize.query("SELECT m.*, c.Name AS CategoryName FROM Memorials m INNER JOIN Categories c ON m.Category = c.id WHERE m.ID = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT
      })
    } else {
      var result = await sequelize.query("SELECT m.*, c.Name AS CategoryName FROM Memorials m INNER JOIN Categories c ON m.Category = c.id",
      {
        type: QueryTypes.SELECT
      })
    }
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.querySubmissions = async function querySubmissions(id = false) {
  try {
    if (id) {
      var result = await sequelize.query("SELECT s.*, u.FirstName, u.LastName, u.FlagNumber, u.Email, m.Name, m.Code, m.Category, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage FROM Submissions s INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id WHERE s.id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT
      })
    } else {
      var result = await sequelize.query("SELECT s.*, u.FirstName, u.LastName, u.FlagNumber, u.Email, m.Name, m.Code, m.Category, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage FROM Submissions s INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id",
      {
        type: QueryTypes.SELECT
      })
    }
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryMemorial = async function queryMemorial(memCode) {
  try {
    var result = await sequelize.query("SELECT * FROM Memorials WHERE Code = ?",
    {
      replacements: [memCode],
      type: QueryTypes.SELECT
    })
    return result;
  } catch (err) {
    throw err;
  }
}


module.exports.queryMemorialText = async function queryMemorialText(memCode) {
  try {
    var result = await sequelize.query("SELECT m.Code, mt.* FROM Memorials m INNER JOIN MemorialMeta mt ON m.id = mt.MemorialID WHERE m.Code = ? ORDER BY Heading",
    {
      replacements: [memCode],
      type: QueryTypes.SELECT
    })
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

module.exports.queryRiderWithStats = async function queryRiderWithStats(rider = false) {
  try {
    if (rider) {
      var result = await sequelize.query("SELECT * FROM bonusItems bi INNER JOIN bonusLogs bl ON bi.id = bl.bonus_id WHERE iStatus != 0 AND bl.user_id = ?",
      {
        replacements: [rider],
        type: QueryTypes.SELECT
      });
    } else {
      var result = await sequelize.query("SELECT * FROM bonusItems bi INNER JOIN bonusLogs bl ON bi.id = bl.bonus_id WHERE iStatus != 0",
      {
        replacements: [rider],
        type: QueryTypes.SELECT
      });
    }
    
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryAllRiders = async function queryAllRiders(rider = false) {
  try {
    if (rider) {
      var result = await db.User.findAll({
        raw: true,
        where: {
          id: rider
        }
      })
    } else {
      var result = await db.User.findAll({
        raw: true,
      })
    }
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryAllUsers = async function queryAllUsers(user = false) {
  try {
    if (user) {
      var result = await db.User.findAll({
        raw: true,
        where: {
          id: user
        }
      })
    } else {
      var result = await db.User.findAll({
        raw: true,
      })
    }
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryAllScorers = async function queryAllScorers(sponsor = false) {
  try {
    if (sponsor) {
      var result = await db.User.findAll({
        raw: true,
        where: {
          id: sponsor
        }
      })
    } else {
      var result = await db.User.findAll({
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

module.exports.queryEarnedMemorialsByAllRiders = async function queryEarnedMemorialsByAllRiders() {
  try {
    var result = await sequelize.query("SELECT emx.FlagNum, CONCAT(u.FirstName, ' ', u.LastName) AS 'RiderName', COUNT(emx.id) AS 'TotalEarnedMemorials' FROM EarnedMemorialsXref emx INNER JOIN Flags f ON emx.FlagNum = f.FlagNum LEFT JOIN Users u ON f.UserID = u.id INNER JOIN Memorials m on emx.MemorialID = m.id GROUP BY emx.FlagNum, u.FirstName, u.LastName",
    { type: QueryTypes.SELECT });
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryMemorialStatusByRider = async function queryMemorialStatusByRider(rider, memCode) {
  try {
    var result = await sequelize.query("SELECT s.Status FROM Submissions s LEFT JOIN Memorials m ON s.MemorialID = m.id WHERE s.UserID = ? AND m.Code = ? ORDER BY s.updatedAt DESC LIMIT 1",
    {
      replacements: [rider, memCode],
      type: QueryTypes.SELECT
    });
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.querySubmissionsByRider = async function querySubmissionsByRider(rider) {
  try {
    var result = await sequelize.query("SELECT s.id, s.UserId, s.MemorialID, s.Status AS 'StatusID', CASE s.Status WHEN 1 THEN 'Approved' WHEN 2 THEN 'Rejected' ELSE 'Pending' END Status, s.ScorerNotes, s.RiderNotes, s.PrimaryImage, s.OptionalImage, s.createdAt, s.updatedAt, m.Code, m.Name, c.Name AS Category, u.FirstName, u.LastName, u.UserName, u.Email, u.FlagNumber, u.isActive, u.isAdmin FROM Submissions s LEFT JOIN Memorials m ON m.id = s.MemorialID LEFT JOIN Categories c ON c.id = m.Category INNER JOIN Users u ON u.id = s.UserID WHERE s.UserID = ? ORDER BY s.createdAt DESC",
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