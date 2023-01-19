const { Op, QueryTypes } = require('sequelize');

const db = require('../models');
const { sequelize } = require('../models');
const { logger } = require('../controllers/logger');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

module.exports.queryUserSessionDataByID = async function queryUserSessionDataByID(id) {
  try {
    const result = await sequelize.query(
      'SELECT u.id, u.FirstName, u.LastName, IFNULL(f.FlagNumber,0) FlagNumber, u.Email, u.Password, u.Address1, u.City, u.State, u.ZipCode, u.CellNumber, u.TimeZone, tz.LongName AS TimeZoneLong, u.PillionFlagNumber, u.isAdmin, u.isActive FROM Users u INNER JOIN TimeZones tz ON u.TimeZone = tz.LongName LEFT JOIN Flags f ON u.id = f.UserID WHERE u.id = ? ORDER BY f.RallyYear DESC LIMIT 1;',
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryUserSessionDataByID(${id}`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryUserInfoByID = async function queryUserInfoByID(UserID) {
  try {
    const result = await sequelize.query(
      "SELECT u.id, u.FirstName, u.LastName, IFNULL(f.FlagNumber,0) FlagNumber, o.id AS OrderID, CASE WHEN o.PassUserID = u.id THEN 'Pass' WHEN o.UserID = u.id THEN 'Rider' WHEN (ISNULL(o.PassUserID) AND ISNULL(o.UserID)) THEN NULL END AS OrderRole, u.Email, u.Password, u.Address1, u.City, u.State, u.ZipCode, u.CellNumber, u.TimeZone, u.isAdmin, u.isActive FROM Users u LEFT JOIN Flags f ON u.id = f.UserID LEFT JOIN Orders o ON ((u.id = o.UserID) OR (u.id = o.PassUserID)) WHERE u.id = ? ORDER BY f.RallyYear DESC LIMIT 1",
      {
        replacements: [UserID],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryUserInfoByID(${UserID}`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryAllCategories = async function queryAllCategories() {
  try {
    const result = await db.Category.findAll({
      where: {
        Active: 1,
      },
    });
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllCategories()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAllRestrictions = async function queryAllRestrictions() {
  try {
    const result = await db.Restriction.findAll({
      raw: true,
    });
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllRestrictions()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryTokenValidity = async function queryTokenValidity(id, token) {
  try {
    const result = await sequelize.query(
      'SELECT COUNT(id) AS Valid FROM ResetTokens WHERE user_id = ? AND Token = ?',
      {
        replacements: [id, token],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryTokenValidity()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryNewRiderValidation = async function queryNewRiderValidation(username) {
  try {
    const result = await sequelize.query('SELECT * FROM Users WHERE UserName = ?', {
      replacements: [username],
      type: QueryTypes.SELECT,
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryNewRiderValidation(${username})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryUserRights = async function queryUserRights(user) {
  try {
    const result = await db.user.findAll({
      where: {
        id: user,
      },
    });
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryUserRights()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryFindUserByEmail = async function queryFindUserByEmail(email) {
  try {
    const result = await db.User.findAll({
      where: {
        Email: email,
      },
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryFindUserByEmail(${email})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryUserIDFromFlagNum = async function queryUserIDFromFlagNum(flag) {
  try {
    const result = await db.User.findAll({
      where: {
        FlagNumber: {
          [Op.in]: [flag],
        },
      },
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryUserIDFromFlagNum(${flag})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryAllMemorials = async function queryAllMemorials(id = false) {
  let result;
  try {
    if (id) {
      result = await sequelize.query(
        'SELECT m.*, c.Name AS CategoryName FROM Memorials m INNER JOIN Categories c ON m.Category = c.id WHERE c.Active = 1 AND m.ID = ?',
        {
          replacements: [id],
          type: QueryTypes.SELECT,
        },
      );
    } else {
      result = await sequelize.query(
        'SELECT m.*, c.Name AS CategoryName FROM Memorials m INNER JOIN Categories c ON m.Category = c.id WHERE c.Active = 1 ORDER BY m.State, m.City, m.Category',
        {
          type: QueryTypes.SELECT,
        },
      );
    }
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllMemorials()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAllSubmissions = async function queryAllSubmissions(id = false) {
  let result;
  try {
    if (id) {
      result = await sequelize.query(
        "SELECT DISTINCT s.*, u.FirstName, u.LastName, f.FlagNumber, u.Email, m.Name, m.Code, m.Category, c.Name AS CatName, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, CASE m.Restrictions WHEN 1 THEN 'None' WHEN 2 THEN 'Military Base' WHEN 3 THEN 'Museum' WHEN 4 THEN 'Cemetery' WHEN 5 THEN 'Park' WHEN 6 THEN 'Airport' WHEN 7 THEN 'School' WHEN 8 THEN 'Office' WHEN 9 THEN 'Private Property' WHEN 10 THEN 'Fairgrounds' WHEN 11 THEN 'Construction'	WHEN 12 THEN 'Unavailable' WHEN 13 THEN 'Other' WHEN 14 THEN 'See Related Link' END AS 'Restrictions', CASE m.MultiImage WHEN 0 THEN 'No' WHEN 1 THEN 'Yes' END AS MultiImage, CASE WHEN s.Status = 0 THEN 'Pending' WHEN s.Status = 1 THEN 'Approved' WHEN s.Status = 2 THEN 'Rejected' WHEN s.Status = 3 THEN 'Held' END AS StatusText FROM Submissions s INNER JOIN Flags f ON f.UserID = s.UserID INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id INNER JOIN Categories c ON m.Category = c.id WHERE s.id = ?",
        {
          replacements: [id],
          type: QueryTypes.SELECT,
        },
      );
    } else {
      result = await sequelize.query(
        'SELECT DISTINCT s.*, u.FirstName, u.LastName, f.FlagNumber, u.Email, m.Name, m.Code, m.Category, c.Name AS CatName, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage, CASE WHEN s.Status = 0 THEN "Pending" WHEN s.Status = 1 THEN "Approved" WHEN s.Status = 2 THEN "Rejected" WHEN s.Status = 3 THEN "Held" END AS StatusText FROM Submissions s INNER JOIN Flags f ON f.UserID = s.UserID INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id	INNER JOIN Categories c ON m.Category = c.id',
        {
          type: QueryTypes.SELECT,
        },
      );
    }
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllSubmissions()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryPendingSubmissions = async function queryPendingSubmissions(id = false) {
  let result;
  try {
    if (id) {
      result = await sequelize.query(
        "SELECT s.*, u.FirstName, u.LastName, f.FlagNumber, u.Email, m.Name, m.Code, m.Category, c.Name AS CatName, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, CASE m.Restrictions WHEN 1 THEN 'None' WHEN 2 THEN 'Military Base' WHEN 3 THEN 'Museum' WHEN 4 THEN 'Cemetery' WHEN 5 THEN 'Park' WHEN 6 THEN 'Airport' WHEN 7 THEN 'School' WHEN 8 THEN 'Office' WHEN 9 THEN 'Private Property' WHEN 10 THEN 'Fairgrounds' WHEN 11 THEN 'Construction'	WHEN 12 THEN 'Unavailable' WHEN 13 THEN 'Other' WHEN 14 THEN 'See Related Link' END AS 'Restrictions', CASE m.MultiImage WHEN 0 THEN 'No' WHEN 1 THEN 'Yes' END AS MultiImage, CASE WHEN s.Status = 0 THEN 'Pending' WHEN s.Status = 1 THEN 'Approved' WHEN s.Status = 2 THEN 'Rejected' WHEN s.Status = 3 THEN 'Held' END AS StatusText FROM Submissions s INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id INNER JOIN Categories c ON m.Category = c.id INNER JOIN Flags f ON f.UserID = u.id WHERE s.id = ?",
        {
          replacements: [id],
          type: QueryTypes.SELECT,
        },
      );
    } else {
      result = await sequelize.query(
        "SELECT s.*, u.FirstName, u.LastName, f.FlagNumber, u.Email, m.Name, m.Code, m.Category, c.Name AS CatName, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage, CASE WHEN s.Status = 0 THEN 'Pending' WHEN s.Status = 1 THEN 'Approved' WHEN s.Status = 2 THEN 'Rejected' WHEN s.Status = 3 THEN 'Held' END AS StatusText FROM Submissions s INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id	INNER JOIN Categories c ON m.Category = c.id INNER JOIN Flags f ON f.UserID = u.id WHERE s.Status IN (0,3)",
        {
          type: QueryTypes.SELECT,
        },
      );
    }
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryPendingSubmissions()', {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryPendingSubmissionsWithDetails =
  async function queryPendingSubmissionsWithDetails() {
    let result;
    try {
      result = await sequelize.query(
        "SELECT s.*, u.FirstName, u.LastName, u.FlagNumber, u.Email, m.Name, m.Code, m.Category, c.Name AS CatName, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage, CASE WHEN s.Status = 0 THEN 'Pending' WHEN s.Status = 1 THEN 'Approved' WHEN s.Status = 2 THEN 'Rejected' WHEN s.Status = 3 THEN 'Held' END AS StatusText FROM Submissions s INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id	INNER JOIN Categories c ON m.Category = c.id WHERE s.Status IN (0,3)",
        {
          type: QueryTypes.SELECT,
        },
      );
      return result;
    } catch (err) {
      logger.error('An error was encountered in queryPendingSubmissionsWithDetails()', {
        calledBy: 'queries.js',
      });
      throw err;
    }
  };

module.exports.queryScoredSubmissions = async function queryScoredSubmissions(id = false) {
  let result;
  try {
    if (id) {
      result = await sequelize.query(
        "SELECT DISTINCT s.*, u.FirstName, u.LastName, u.FlagNumber, u.Email, m.Name, m.Code, m.Category, c.Name AS CatName, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, CASE m.Restrictions WHEN 1 THEN 'None' WHEN 2 THEN 'Military Base' WHEN 3 THEN 'Museum' WHEN 4 THEN 'Cemetery' WHEN 5 THEN 'Park' WHEN 6 THEN 'Airport' WHEN 7 THEN 'School' WHEN 8 THEN 'Office' WHEN 9 THEN 'Private Property' WHEN 10 THEN 'Fairgrounds' WHEN 11 THEN 'Construction'	WHEN 12 THEN 'Unavailable' WHEN 13 THEN 'Other' WHEN 14 THEN 'See Related Link' END AS 'Restrictions', CASE m.MultiImage WHEN 0 THEN 'No' WHEN 1 THEN 'Yes' END AS MultiImage, CASE WHEN s.Status = 0 THEN 'Pending' WHEN s.Status = 1 THEN 'Approved' WHEN s.Status = 2 THEN 'Rejected' WHEN s.Status = 3 THEN 'Held' END AS StatusText FROM Submissions s INNER JOIN Users u ON s.UserID = u.id INNER JOIN Memorials m ON s.MemorialID = m.id INNER JOIN Categories c ON m.Category = c.id WHERE s.id = ?",
        {
          replacements: [id],
          type: QueryTypes.SELECT,
        },
      );
    } else {
      result = await sequelize.query(
        "SELECT DISTINCT s.*, u.FirstName, u.LastName, f.FlagNumber, u.Email, m.Name, m.Code, m.Category, c.Name AS CatName, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage, CASE WHEN s.Status = 0 THEN 'Pending' WHEN s.Status = 1 THEN 'Approved' WHEN s.Status = 2 THEN 'Rejected' WHEN s.Status = 3 THEN 'Held' END AS StatusText FROM Submissions s INNER JOIN Users u ON s.UserID = u.id LEFT JOIN Flags f ON f.UserID = s.UserID INNER JOIN Memorials m ON s.MemorialID = m.id	INNER JOIN Categories c ON m.Category = c.id WHERE s.Status IN (1,2)",
        {
          type: QueryTypes.SELECT,
        },
      );
    }
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryScoredSubmissions()', {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryMemorial = async function queryMemorial(memCode) {
  try {
    const result = await sequelize.query('SELECT * FROM Memorials WHERE Code = ?', {
      replacements: [memCode],
      type: QueryTypes.SELECT,
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryMemorial(${memCode})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryMemorialText = async function queryMemorialText(memCode) {
  try {
    const result = await sequelize.query(
      'SELECT m.Code, mt.* FROM Memorials m INNER JOIN MemorialMeta mt ON m.id = mt.MemorialID WHERE m.Code = ? ORDER BY Heading',
      {
        replacements: [memCode],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryMemorialText(${memCode})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryAllRiders = async function queryAllRiders(rider = false) {
  let result;
  try {
    if (rider) {
      result = await db.User.findAll({
        raw: true,
        where: {
          id: rider,
        },
      });
    } else {
      result = await db.User.findAll({
        raw: true,
      });
    }
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllRiders()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAllUsers = async function queryAllUsers(user = false) {
  let result;
  try {
    if (user) {
      result = await db.User.findAll({
        raw: true,
        where: {
          id: user,
        },
      });
    } else {
      result = await db.User.findAll({
        raw: true,
      });
    }
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllUsers()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAllUsersWithFlagInfo = async function queryAllUsersWithFlagInfo(year) {
  let result;
  try {
    result = await sequelize.query(
      'SELECT u.*, f.FlagNumber FROM Users u INNER JOIN Flags f ON u.id = f.UserID WHERE u.isActive = 1 AND f.RallyYear = ? ORDER BY f.FlagNumber',
      {
        replacements: [year],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryAllUsersWithFlagInfo()`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryActiveRiderInfo = async function queryActiveRiderInfo(id) {
  let result;
  try {
    result = await sequelize.query(
      'SELECT u.*, f.FlagNumber FROM Users u INNER JOIN Flags f ON u.id = f.UserID WHERE u.isActive = 1 AND u.id = ? AND f.RallyYear = ?',
      {
        replacements: [id, currentRallyYear],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryActiveRiderInfo(${id})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryAllScorers = async function queryAllScorers(sponsor = false) {
  let result;
  try {
    if (sponsor) {
      result = await db.User.findAll({
        raw: true,
        where: {
          id: sponsor,
        },
      });
    } else {
      result = await db.User.findAll({
        raw: true,
      });
    }
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllScorers()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAllBikes = async function queryAllBikes(rider = false) {
  let result;
  try {
    if (rider) {
      result = await db.Bike.findAll({
        raw: true,
        where: {
          user_id: rider,
        },
      });
    } else {
      result = await db.Bike.findAll({
        raw: true,
      });
    }
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllBikes()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryBikesByRider = async function queryBikesByRider(rider) {
  let result;
  try {
    result = await db.Bike.findAll({
      raw: true,
      where: {
        user_id: rider,
      },
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryBikesByRider(${rider})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryNextPendingSubmissions = async function queryNextPendingSubmissions(category) {
  let result;
  try {
    if (category === 'all') {
      result = await sequelize.query('SELECT id FROM Submissions WHERE Status = 0 LIMIT 1', {
        type: QueryTypes.SELECT,
      });
    } else {
      result = await sequelize.query(
        'SELECT s.id FROM Submissions s INNER JOIN Memorials m ON s.MemorialID = m.id INNER JOIN Categories c ON m.Category = c.id WHERE c.Name = ? AND s.Status = 0 ORDER BY s.id ASC LIMIT 1',
        {
          replacements: [category],
          type: QueryTypes.SELECT,
        },
      );
    }
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryNextPendingSubmissions(${category})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.querySkipPendingSubmission = async function querySkipPendingSubmission(
  category,
  id,
) {
  let result;
  try {
    if (category === 'all') {
      result = await sequelize.query(
        'SELECT id FROM Submissions WHERE Status = 0 AND id <> ? LIMIT 1',
        {
          replacements: [id],
          type: QueryTypes.SELECT,
        },
      );
    } else {
      result = await sequelize.query(
        'SELECT s.id FROM Submissions s INNER JOIN Memorials m ON s.MemorialID = m.id INNER JOIN Categories c ON m.Category = c.id WHERE c.Name = ? AND s.id <> ? AND s.Status = 0 ORDER BY s.id ASC LIMIT 1',
        {
          replacements: [category, id],
          type: QueryTypes.SELECT,
        },
      );
    }
    return result;
  } catch (err) {
    logger.error(`An error was encountered in querySkipPendingSubmission(${category}, ${id})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryPendingBonusDetail = async function queryPendingBonusDetail(id) {
  let result;
  try {
    result = await db.bonusItem.findAll({
      where: {
        id,
      },
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryPendingBonusDetail(${id})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryPendingRiderInfo = async function queryPendingRiderInfo(rider) {
  let result;
  try {
    result = await db.user.findAll({
      where: {
        id: rider,
      },
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryPendingRiderInfo(${rider})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryPendingBikeInfo = async function queryPendingBikeInfo(rider) {
  let result;
  try {
    result = await db.bike.findAll({
      where: {
        user_id: rider,
      },
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryPendingBikeInfo(${rider})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryEarnedMemorialsByAllRiders = async function queryEarnedMemorialsByAllRiders() {
  try {
    const result = await sequelize.query(
      "SELECT emx.FlagNumber, CONCAT(u.FirstName, ' ', u.LastName) AS 'RiderName', COUNT(emx.id) AS 'TotalEarnedMemorials' FROM EarnedMemorialsXref emx INNER JOIN Flags f ON emx.FlagNumber = f.FlagNumber LEFT JOIN Users u ON f.UserID = u.id INNER JOIN Memorials m on emx.MemorialID = m.id GROUP BY emx.FlagNumber, u.FirstName, u.LastName",
      { type: QueryTypes.SELECT },
    );
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryEarnedMemorialsByAllRiders()', {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryMemorialIDbyMemCode = async function queryMemorialIDbyMemCode(memCode) {
  try {
    const result = await sequelize.query('SELECT id from Memorials WHERE Code = ? LIMIT 1', {
      replacements: [memCode],
      type: QueryTypes.SELECT,
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryMemorialIDbyMemCode(${memCode})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryMemorialStatusByRider = async function queryMemorialStatusByRider(
  rider,
  memCode,
) {
  try {
    const result = await sequelize.query(
      'SELECT id FROM EarnedMemorialsXref WHERE FlagNumber = ? AND MemorialID = ?',
      {
        replacements: [rider, memCode],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryMemorialStatusByRider(${rider}, ${memCode})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.querySubmissionStatusByRider = async function querySubmissionStatusByRider(
  rider,
  memCode,
) {
  try {
    const result = await sequelize.query(
      'SELECT s.Status FROM Submissions s LEFT JOIN Memorials m ON s.MemorialID = m.id WHERE m.Code = ? AND (s.UserID = ? OR FIND_IN_SET((SELECT FlagNumber FROM Flags WHERE UserID = ?), OtherRiders)) ORDER BY s.updatedAt DESC LIMIT 1',
      {
        replacements: [memCode, rider, rider],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in querySubmissionStatusByRider(${rider}, ${memCode})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.querySubmissionStatusBySubID = async function querySubmissionStatusBySubID(id) {
  try {
    const result = await sequelize.query(
      'SELECT Status FROM Submissions WHERE id = ? ORDER BY updatedAt DESC LIMIT 1',
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in querySubmissionStatusBySubID(${id})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.querySubmissionsByRider = async function querySubmissionsByRider(rider) {
  try {
    const result = await sequelize.query(
      "SELECT s.id, s.UserId, s.MemorialID, s.Status AS 'StatusID', CASE s.Status WHEN 1 THEN 'Approved' WHEN 2 THEN 'Rejected' WHEN 3 THEN 'In Review' ELSE 'Pending' END Status, s.ScorerNotes, s.RiderNotes, s.createdAt, m.Code, m.Name, c.Name AS Category FROM Submissions s LEFT JOIN Memorials m ON m.id = s.MemorialID LEFT JOIN Categories c ON c.id = m.Category WHERE s.UserID = ? ORDER BY s.createdAt DESC",
      {
        replacements: [rider],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in querySubmissionsByRider(${rider})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryRegionList = async function queryRegionList() {
  try {
    const result = await sequelize.query('SELECT id, Region FROM Regions ORDER BY Region', {
      type: QueryTypes.SELECT,
    });
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryRegionList()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryTrophiesList = async function queryTrophiesList() {
  try {
    const result = await sequelize.query(
      'SELECT r.Region, t.PlaceNum, t.FlagNumbers FROM Trophies t LEFT JOIN Regions r ON t.RegionID = r.id',
      {
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryTrophiesList()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAwardList = async function queryAwardList() {
  try {
    const result = await sequelize.query(
      'SELECT a.id, a.Name, a.RideDate, a.FlagNumber, u.FirstName, u.LastName FROM Awards a LEFT JOIN Users u ON a.FlagNumber = u.FlagNumber',
      {
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAwardList()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAwardNamesList = async function queryAwardNamesList() {
  try {
    const result = await db.AwardName.findAll({});
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAwardNamesList()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryBaseRiderRate = async function queryBaseRiderRate() {
  try {
    const result = await sequelize.query('SELECT Price FROM PriceTiers WHERE Tier = 1', {
      type: QueryTypes.SELECT,
    });
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryBaseRiderRate()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryPassengerInfoByRider = async function queryPassengerInfoByRider(
  riderFlagNumber,
) {
  try {
    const result = await db.Passenger.findAll({
      where: {
        RiderFlagNumber: riderFlagNumber,
      },
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryPassengerInfoByRider(${riderFlagNumber})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryPassengerSurcharge = async function queryPassengerSurcharge() {
  try {
    const result = await sequelize.query(
      "SELECT iValue FROM Configs WHERE KeyName = 'Passenger Surcharge'",
      {
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryPassengerSurcharge()', {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryShirtSizeSurcharge = async function queryShirtSizeSurcharge() {
  try {
    const result = await sequelize.query(
      "SELECT iValue FROM Configs WHERE KeyName = 'Shirt Size Surcharge'",
      {
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryShirtSizeSurcharge()', {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryShirtStyleSurcharge = async function queryShirtStyleSurcharge() {
  try {
    const result = await sequelize.query(
      "SELECT iValue FROM Configs WHERE KeyName = 'Shirt Style Surcharge'",
      {
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryShirtStyleSurcharge()', {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryTierByPrice = async function queryTierByPrice(price) {
  try {
    const result = await sequelize.query(
      'SELECT Tier, ShopifyVariantID FROM PriceTiers WHERE Price = ? AND IsActive = 1',
      {
        replacements: [price],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryTierByPrice(${price})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryAllOrders = async function queryAllOrders() {
  try {
    const result = await sequelize.query('SELECT * FROM Orders WHERE CheckOutID IS NOT NULL', {
      type: QueryTypes.SELECT,
    });
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllOrders()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryOrderInfoByRider = async function queryOrderInfoByRider(UserID, Year) {
  try {
    const result = await sequelize.query(
      "SELECT o.*, u1.FirstName AS RiderFirstName,  u1.LastName AS RiderLastName,  CASE WHEN o.PassUserID = 0 THEN 'N/A' ELSE CONCAT(u2.FirstName, ' ', u2.LastName) END AS PassengerName,  CASE WHEN o.CharityChosen = 0 THEN 'Default' ELSE c.Name END AS CharityName FROM Orders o  LEFT JOIN Users u1 ON o.UserID = u1.id  LEFT JOIN Users u2 ON o.PassUserID = u2.id  LEFT JOIN PriceTiers pt ON o.PriceTier = pt.id  LEFT JOIN Charities c ON o.CharityChosen = c.id WHERE o.UserID = ? AND o.RallyYear = ?",
      {
        replacements: [UserID, Year],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryOrderInfoByRider(${UserID},${Year})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryFlagNumFromUserID = async function queryFlagNumFromUserID(PassUserID, Year) {
  try {
    const result = await db.Flag.findOne({
      where: {
        UserID: PassUserID,
        RallyYear: Year,
      },
    });
    return result;
  } catch (err) {
    logger.error(`queryOrderInfoByRider:${err}`);
    logger.error(`An error was encountered in queryFlagNumFromUserID(${PassUserID}, ${Year})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryNextOrderStepByID = async function queryNextOrderStepByID(UserID) {
  try {
    const result = await sequelize.query('SELECT NextStepNum FROM Orders WHERE UserID = ?', {
      replacements: [UserID],
      type: QueryTypes.SELECT,
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryNextOrderStepByID(${UserID})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryCheckoutURLByRider = async function queryCheckoutURLByRider(UserID) {
  try {
    const result = await sequelize.query('SELECT CheckoutURL FROM Orders WHERE UserID = ?', {
      replacements: [UserID],
      type: QueryTypes.SELECT,
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryCheckoutURLByRider(${UserID})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryOrderNumberByRider = async function queryOrderNumberByRider(UserID) {
  try {
    const result = await sequelize.query('SELECT OrderNumber FROM Orders WHERE UserID = ?', {
      replacements: [UserID],
      type: QueryTypes.SELECT,
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryOrderNumberByRider(${UserID})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryAllCharities = async function queryAllCharities() {
  try {
    const result = await sequelize.query(
      'SELECT c.id, c.Name, c.URL, c.RallyYear, COUNT(o.CharityChosen) AS TotalDonations FROM Charities c LEFT OUTER JOIN Orders o ON o.CharityChosen = c.id AND o.OrderNumber > 0 GROUP BY c.id',
      {
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllCharities()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryTotalOrderCostByRider = async function queryTotalOrderCostByRider(UserID) {
  try {
    const result = await sequelize.query(
      'SELECT Price FROM PriceTiers WHERE Tier = (SELECT PriceTier FROM Orders WHERE UserID = ?)',
      {
        replacements: [UserID],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`queryTotalOrderCostByRider:${err}`);
    logger.error(`An error was encountered in queryTotalOrderCostByRider(${UserID})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryAllGroups = async function queryAllGroups() {
  try {
    const result = await db.UserGroup.findAll({});
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllGroups()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAllConfigs = async function queryAllConfigs() {
  try {
    const result = await db.Config.findAll({});
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllConfigs()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAllFAQs = async function queryAllFAQs() {
  try {
    const result = await db.Faq.findAll({});
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllFAQs()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryAllRules = async function queryAllRules() {
  try {
    const result = await db.Rule.findAll({});
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllRules()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryWaiverIDByUser = async function queryWaiverIDByUser(UserID) {
  try {
    const result = await db.Waiver.findOne({
      where: {
        UserID,
      },
    });
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryWaiverIDByUser(${UserID})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryWaiversByOrderID = async function queryWaiversByOrderID(OrderID) {
  try {
    const result = await sequelize.query(
      'SELECT w.* FROM Orders o LEFT JOIN Waivers w ON ((o.UserID = w.UserID) OR (o.PassUserID = w.UserID)) WHERE o.id = ?',
      {
        replacements: [OrderID],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryWaiversByOrderID(${OrderID})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryAllBikes = async function queryAllBikes(rider = false) {
  let result;
  try {
    if (rider) {
      result = await db.Bike.findAll({
        raw: true,
        where: {
          user_id: rider,
        },
      });
    } else {
      result = await db.Bike.findAll({
        raw: true,
      });
    }
    return result;
  } catch (err) {
    logger.error('An error was encountered in queryAllBikes()', { calledBy: 'queries.js' });
    throw err;
  }
};

module.exports.queryTimeZoneData = async function queryTimeZoneData(TimeZone = false) {
  let TimeZoneData;
  try {
    if (TimeZone) {
      TimeZoneData = await db.TimeZone.findOne({
        where: {
          LongName: TimeZone,
        },
      });
    } else {
      TimeZoneData = await db.TimeZone.findAll({
        raw: true,
      });
    }
    return TimeZoneData;
  } catch (err) {
    logger.error(`An error was encountered in queryTimeZoneData(${TimeZone})`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryTotalDonationsByCharity = async function queryTotalDonationsByCharity() {
  try {
    const result = await sequelize.query(
      'SELECT c.Name AS CharityName, COUNT(*) AS TotalDonations FROM Orders o LEFT JOIN Charities c ON c.id = o.CharityChosen WHERE o.OrderNumber > 0 GROUP BY o.CharityChosen;',
      {
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryTotalDonationsByCharity()`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};

module.exports.queryEarnedMemorialCountByFlag = async function queryEarnedMemorialCountByFlag(
  rallyYear,
  flag,
) {
  try {
    const result = await sequelize.query(
      'SELECT c.Name, COUNT(*) AS Earned FROM Categories c LEFT JOIN Memorials m ON m.Category = c.id LEFT JOIN EarnedMemorialsXref emx ON emx.MemorialID = m.id WHERE emx.RallyYear = ? AND emx.FlagNumber = ? GROUP BY c.id ORDER BY c.id',
      {
        replacements: [rallyYear, flag],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(
      `An error was encountered in queryEarnedMemorialCountByFlag(${rallyYear}, ${flag})`,
      {
        calledBy: 'queries.js',
      },
    );
    throw err;
  }
};

module.exports.queryEarnedMemorialListByFlag = async function queryEarnedMemorialListByFlag(
  rallyYear,
  flag,
) {
  try {
    const result = await sequelize.query(
      'SELECT m.Category AS Category, GROUP_CONCAT(m.Code ORDER BY m.Code ASC SEPARATOR ", ") AS Codes FROM Memorials m LEFT JOIN EarnedMemorialsXref emx ON emx.MemorialID = m.id WHERE emx.RallyYear = ? AND emx.FlagNumber = ? GROUP BY m.Category;',
      {
        replacements: [rallyYear, flag],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(
      `An error was encountered in queryEarnedMemorialListByFlag(${rallyYear}, ${flag})`,
      {
        calledBy: 'queries.js',
      },
    );
    throw err;
  }
};

module.exports.queryCompletedStatesListByFlag = async function queryCompletedStatesListByFlag(
  rallyYear,
  flag,
) {
  try {
    const result = await sequelize.query(
      'SELECT r.Region, r.MemorialCount, CASE WHEN (COUNT(emx.id) >= r.MemorialCount) THEN "Y" ELSE "N" END AS StateEarned FROM Regions r LEFT JOIN Memorials m ON m.Region = r.Region LEFT JOIN EarnedMemorialsXref emx ON emx.MemorialID = m.id WHERE m.Category = 1 AND emx.RallyYear = ? AND emx.FlagNumber = ? GROUP BY r.Region, r.MemorialCount HAVING StateEarned = "Y";',
      {
        replacements: [rallyYear, flag],
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(
      `An error was encountered in queryCompletedStatesListByFlag(${rallyYear}, ${flag})`,
      {
        calledBy: 'queries.js',
      },
    );
    throw err;
  }
};

module.exports.queryAllFlagReservations = async function queryAllFlagReservations() {
  try {
    const result = await sequelize.query(
      "SELECT rf.id, rf.FlagNumber, rf.Notes, CONCAT(u.FirstName, ' ', u.LastName) AS ReservedBy, rf.createdAt FROM ReservedFlags rf INNER JOIN Users u ON rf.ReservedBy = u.id",
      {
        type: QueryTypes.SELECT,
      },
    );
    return result;
  } catch (err) {
    logger.error(`An error was encountered in queryAllFlagReservations()`, {
      calledBy: 'queries.js',
    });
    throw err;
  }
};
