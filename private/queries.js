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

module.exports.queryFindUserByEmail = async function queryFindUserByEmail(email) {
  try {
    var result = await db.User.findAll({
      where: {
        Email: email
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
        FlagNumber: {
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

module.exports.queryAllMemorialsWithUserStatus = async function queryAllMemorialsWithUserStatus(id) {
  try {
    var result = await sequelize.query("SELECT s.Status AS 'RiderStatus',m.*, c.Name AS CategoryName FROM Memorials m INNER JOIN Categories c ON m.Category = c.id LEFT JOIN Submissions s ON m.id = s.MemorialID AND s.UserID = ? ORDER BY m.State, m.City, m.Category",
    {
      replacements: [id],
      type: QueryTypes.SELECT
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryMemorialStatusByUser = async function queryMemorialStatusByUser(memId, userId) {
  try {
    var result = await sequelize.query("SELECT Status FROM Submissions WHERE MemorialID = ? AND UserID = ? ORDER BY updatedAt DESC LIMIT 1",
    {
      replacements: [memId, userId],
      type: QueryTypes.SELECT
    })
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryAllMemorials = async function queryAllMemorials(id = false) {
  try {
    if (id) {
      var result = await sequelize.query("SELECT m.*, c.Name AS CategoryName FROM Memorials m INNER JOIN Categories c ON m.Category = c.id WHERE c.Active = 1 AND m.ID = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT
      })
    } else {
      var result = await sequelize.query("SELECT m.*, c.Name AS CategoryName FROM Memorials m INNER JOIN Categories c ON m.Category = c.id WHERE c.Active = 1 ORDER BY m.State, m.City, m.Category",
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
      var result = await sequelize.query("SELECT s.*, u.FirstName, u.LastName, u.FlagNumber, u.Email, m.Name, m.Code, m.Category, c.Name AS CatName, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage, CASE WHEN s.Status = 0 THEN \"Pending\" WHEN s.Status = 1 THEN \"Approved\" WHEN s.Status = 2 THEN \"Rejected\" WHEN s.Status = 3 THEN \"Held\" END AS StatusText FROM Submissions s INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id	INNER JOIN Categories c ON m.Category = c.id WHERE s.id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT
      })
    } else {
      var result = await sequelize.query("SELECT s.*, u.FirstName, u.LastName, u.FlagNumber, u.Email, m.Name, m.Code, m.Category, c.Name AS CatName, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage, CASE WHEN s.Status = 0 THEN \"Pending\" WHEN s.Status = 1 THEN \"Approved\" WHEN s.Status = 2 THEN \"Rejected\" WHEN s.Status = 3 THEN \"Held\" END AS StatusText FROM Submissions s INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id	INNER JOIN Categories c ON m.Category = c.id",
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

module.exports.queryMemorialData = async function queryMemorialData(id) {
  try {
    var result = await sequelize.query("SELECT c.Name AS CategoryName, r.Name AS RestrictionName, m.* FROM Memorials m INNER JOIN Categories c ON m.Category = c.id INNER JOIN Restrictions r ON m.Restrictions = r.id WHERE m.id = ? LIMIT 1",
    {
      replacements: [id],
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
      var result = await db.Bike.findAll({
        raw: true,
        where: {
          user_id: rider
        }
      })
    } else {
      var result = await db.Bike.findAll({
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

module.exports.queryNextPendingSubmissions = async function queryNextPendingSubmissions(category) {
  try {
    if (category == "all") {
      var result = await sequelize.query("SELECT id FROM Submissions WHERE Status = 0 LIMIT 1",
      {
        type: QueryTypes.SELECT
      });
    } else {
      var result = await sequelize.query("SELECT s.id FROM Submissions s INNER JOIN Memorials m ON s.MemorialID = m.id INNER JOIN Categories c ON m.Category = c.id WHERE c.Name = ? AND s.Status = 0 ORDER BY s.id ASC LIMIT 1",
      {
        replacements: [category],
        type: QueryTypes.SELECT
      });
    }
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.querySkipPendingSubmission = async function querySkipPendingSubmission(category, id) {
  try {
    if (category == "all") {
      var result = await sequelize.query("SELECT id FROM Submissions WHERE Status = 0 AND id <> ? LIMIT 1",
      {
        replacements: [id],
        type: QueryTypes.SELECT
      });
    } else {
      var result = await sequelize.query("SELECT s.id FROM Submissions s INNER JOIN Memorials m ON s.MemorialID = m.id INNER JOIN Categories c ON m.Category = c.id WHERE c.Name = ? AND s.id <> ? AND s.Status = 0 ORDER BY s.id ASC LIMIT 1",
      {
        replacements: [category, id],
        type: QueryTypes.SELECT
      });
    }
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

module.exports.queryMemorialIDbyMemCode = async function queryMemorialIDbyMemCode(memCode) {
  try {
    var result = await sequelize.query("SELECT id from Memorials WHERE Code = ? LIMIT 1",
    {
      replacements: [memCode],
      type: QueryTypes.SELECT
    });
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.queryMemorialStatusByRider = async function queryMemorialStatusByRider(rider, memCode) {
  try {
    var result = await sequelize.query("SELECT id FROM EarnedMemorialsXref WHERE FlagNum = ? AND MemorialID = ?",
    {
      replacements: [rider, memCode],
      type: QueryTypes.SELECT
    });
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.querySubmissionStatusByRider = async function querySubmissionStatusByRider(rider, memCode) {
  try {
    var result = await sequelize.query("SELECT s.Status FROM Submissions s LEFT JOIN Memorials m ON s.MemorialID = m.id WHERE m.Code = ? AND (s.UserID = ? OR FIND_IN_SET((SELECT FlagNum FROM Flags WHERE UserID = ?), OtherRiders)) ORDER BY s.updatedAt DESC LIMIT 1",
    {
      replacements: [memCode, rider, rider],
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