"use strict";
const CommonResouceFunctions = require("../../Common/resourceAccess/QTrafficCommonResourceAccess");
const DB = require("../../../models");
const tableName = "m_intersection";
const { Op } = require("sequelize");

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(
    tableName,
    id,
    data,
    "Intersection_ID"
  );
}

async function find(filter, skip, limit, order) {
  return await CommonResouceFunctions.find(
    tableName,
    filter,
    skip,
    limit,
    order
  );
}

async function findById(id, key) {
  return await CommonResouceFunctions.findById(tableName, key, id);
}

async function count(filter, order) {
  return await CommonResouceFunctions.count(tableName, filter, order);
}

async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}

async function customFind(functionName, filter, limit, skip) {
  let filterParams = {};
  if (filter.Intersection_name) {
    filterParams.Intersection_name = {
      [Op.like]: "%" + filter.Intersection_name + "%",
    };
  }
  if (filter.User_ID) {
    filterParams.User_ID = filter.User_ID;
  }
  let queryBuilder = await DB[tableName][functionName]({
    offset: skip,
    limit: limit,
    order: [["CreateDateTime", "DESC"]],
    where: {
      ...filterParams,
      Service_Mapping_ID: filter.Service_Mapping_ID,
      is_deleted: 0,
    },
  });

  if (functionName === "findAll" && queryBuilder && queryBuilder.length > 0) {
    for (let i = 0; i < queryBuilder.length; i++) {
      if (queryBuilder[i].dataValues.Last_Update_By) {
        queryBuilder[i].dataValues.Last_Update_By_Data =
          await DB.m_user.findOne({
            where: {
              User_ID: queryBuilder[i].Last_Update_By,
            },
            attributes: ["User_Name", "Email"],
            raw: true,
          });
      }

      queryBuilder[i].dataValues.total_camera = await DB.m_camera.count({
        where: {
          Intersection_ID: queryBuilder[i].dataValues.Intersection_ID,
          is_deleted: 0,
        },
      });

      queryBuilder[i].dataValues.total_camera_online = await DB.m_camera.count({
        where: {
          Intersection_ID: queryBuilder[i].dataValues.Intersection_ID,
          Status: 1,
          is_deleted: 0,
        },
      });
    }
  }
  console.log(queryBuilder);
  return queryBuilder;
}

async function getDetailIntersection(intersectionId) {
  let detailInterSection = await DB.m_intersection.findOne({
    where: {
      Intersection_ID: intersectionId,
    },
  });
  if (detailInterSection) {
    detailInterSection.dataValues.cameras = await DB.m_camera.findAll({
      where: {
        Intersection_ID: intersectionId,
      },
      raw: true,
    });
    detailInterSection.dataValues.total_cameras =
      detailInterSection.dataValues.cameras.length;

    if (detailInterSection.dataValues.Last_Update_By) {
      detailInterSection.dataValues.Last_Update_By_data =
        await DB.m_user.findOne({
          where: {
            User_ID: detailInterSection.dataValues.Last_Update_By,
          },
          attributes: ["Email"],
        });
    }
    return detailInterSection.dataValues;
  }
  return {};
}

module.exports = {
  find,
  findById,
  deleteById,
  count,
  updateById,
  insert,
  customFind,
  getDetailIntersection,
};
