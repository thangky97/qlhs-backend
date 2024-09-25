"use strict";
const e = require("cors");
const { document_label, document_content } = require("../../../models");
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

async function create(data) {
  try {
    let document = await CommonResouceFunctions.insert("document", {
      image: data.image,
      type: data.type,
      sort_order: data.sort_order,
      open: data.open,
      lang: data.lang,
    });

    if (document) {
      let document_label = await CommonResouceFunctions.insert(
        "document_label",
        {
          lang: data.lang,
          document_id: document.id,
          label: data.label,
        }
      );

      let document_content = await CommonResouceFunctions.insert(
        "document_content",
        {
          lang: data.lang,
          document_id: document.id,
          short_content: data.short_content,
          content: data.content,
        }
      );
      document.label = document_label.toJSON();
      document.content = document_content.toJSON();
    }
    return document;
  } catch (e) {
    throw e;
  }
}

function _buildObject(obj) {
  let result = obj;
  let keys = Object.keys(result);
  for (let i = 0; i < keys.length; i++) {
    if (
      result[keys[i]] === undefined ||
      result[keys[i]] === null ||
      result[keys[i]] === ""
    ) {
      delete result[keys[i]];
    }
  }
  keys = Object.keys(result);
  if (keys.length === 0) return null;
  return result;
}

async function updateById(id, data) {
  try {
    let objUpdate = _buildObject({
      image: data.image,
      status: data.status,
      type: data.type,
      open: data.open,
      sort_order: data.sort_order,
      lang: data.lang,
    });
    if (objUpdate) {
      await CommonResouceFunctions.updateById("document", id, objUpdate);
    }

    if (data.label && data.lang) {
      var document_label = await db.document_label.findOne({
        where: { document_id: id, lang: data.lang },
      });
      if (document_label) {
        await document_label.update({
          label: data.label,
        });
        await document_label.save();
      } else {
        await db.document_label.create({
          lang: data.lang,
          document_id: id,
          label: data.label,
        });
      }
    }

    if (data.lang && (data.content || data.short_content)) {
      let payload_content = {};
      if (data.content) payload_content.content = data.content;
      if (data.short_content)
        payload_content.short_content = data.short_content;

      var document_content = await db.document_content.findOne({
        where: { document_id: id, lang: data.lang },
      });
      if (document_content) {
        await document_content.update(payload_content);
        await document_content.save();
      } else {
        payload_content.lang = data.lang;
        payload_content.document_id = id;
        await db.document_content.create(payload_content);
      }
    }

    return data;
  } catch (e) {
    throw e;
  }
}

async function find(filter, language, skip, limit, order) {
  console.log("data filter documetn ");
  let query = filter;
  if (filter.type) {
    query.type = {
      [db.Sequelize.Op.like]: `%${filter.type}%`,
    };
  }
  if (filter.lang) {
    query.lang = {
      [db.Sequelize.Op.like]: `%${filter.lang}%`,
    };
  }
  console.log(filter, language, skip, limit, order);
  return await db.document.findAll({
    where: query,
    offset: skip,
    limit: limit,
    order: [order],
  });
}

async function findById(id, language) {
  try {
    console.log(id, language);
    return await db.document.findOne({
      where: { id: id },
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function count(filter) {
  try {
    return await db.document.count({ where: filter });
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  find,
  findById,
  count,
  updateById,
  create,
};
