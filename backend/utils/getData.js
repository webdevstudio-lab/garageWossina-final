const prisma = require('../config/prismaConfig');
const express = require('express');

const clientIsInDataBase = async (res, id) => {
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) {
    return res
      .status(404)
      .json({ success: false, message: "ce client n'existe pas!" });
  }
};

const factureIsInDatabase = async (res, statusCode, id) => {};

module.exports = clientIsInDataBase;
