/**********************************************/
/***********  Import external modules ******************/
const prisma = require('../config/prismaConfig');

//CREATE NEW USER
exports.newClient = async (req, res, next) => {
  const { name, phone, email, address, type } = req.body;

  try {
    //**On supprimer les espace dans les champs */
    const data = [
      name.toUpperCase().trim(),
      phone.trim(),
      email.trim(),
      address.trim(),
      type.trim(),
    ];
    //On verifie si le client n'existe pas
    const client = await prisma.client.findUnique({
      where: { phone: data[1] },
    });
    if (client)
      return res
        .status(409)
        .json({ success: false, message: 'Ce client exist déja!' });

    //**On enregistre le client dans la base de donnée */
    const newclient = await prisma.client.create({
      data: {
        name: data[0],
        phone: data[1],
        email: data[2],
        address: data[3],
        type: data[4],
        password: '',
        logo: '',
      },
    });
    return res.status(201).json({
      success: true,
      message: 'Client ajouté avec success!!',
      newclient,
    });
  } catch (error) {
    return res.status(400).json({
      success: true,
      message: 'Erreur lors de la creation du client!',
      error,
    });
  }
};

//GET ONE CLIENT
exports.getClient = async (req, res, next) => {
  const id = req.params.id * 1;
  try {
    const client = await prisma.client.findUnique({
      where: { id: id },
      include: {
        devis: {
          orderBy: { createAt: 'desc' },
          select: {
            id: true,
            numDevis: true,
            matricule: true,
            createAt: true,
            total: true,
          },
        },
        facture: {
          orderBy: { createAt: 'desc' },
          select: {
            id: true,
            numFacture: true,
            matricule: true,
            createAt: true,
            total: true,
            etat: true,
          },
        },
      },
    });
    if (!client) {
      return res
        .status(404)
        .json({ success: true, message: 'Ce client n exist pas !' });
    }
    return res.status(200).json({ success: true, client });
  } catch (error) {
    // console.log(error);
    return res
      .status(400)
      .json({ success: false, message: 'Recherche du client échoué!', error });
  }
};

//GET ALL CLIENT
exports.getAllClient = async (req, res, next) => {
  try {
    const allClient = await prisma.client.findMany({
      orderBy: { createAt: 'desc' },
      include: {
        devis: {
          orderBy: { createAt: 'desc' },
          select: {
            numDevis: true,
            total: true,
          },
        },
        facture: {
          orderBy: { createAt: 'desc' },
          select: {
            numFacture: true,
            total: true,
          },
        },
      },
    });

    if (allClient.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'La base de donnée est vide!',
        allClient,
      });
    }
    return res.status(200).json({ success: true, allClient });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la recherche des clients',
      error,
    });
  }
};

//UPDATE ONE CLIENT
exports.updateClient = async (req, res, next) => {
  const { name, phone, email, address, type } = req.body;
  const id = req.params.id * 1;
  try {
    const data = [
      name.toUpperCase().trim(),
      phone.trim(),
      email.trim(),
      address.trim(),
      type.trim(),
    ];

    //On verifie si le client existe dans la bas de donnée
    const client = await prisma.client.findUnique({
      where: { id },
    });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Ce client n'existe pas!",
      });
    }
    const verifnum = data[1] === client.phone;
    if (!verifnum) {
      //**On verifie si le nouveau numero n'existe pas déja */
      const verifclient = await prisma.client.findUnique({
        where: { phone: data[1] },
      });
      if (verifclient) {
        return res.status(409).json({
          success: false,
          message: 'Ce numero de telephone est utilisé par un autre client!',
        });
      }
    }
    //**On met a jour les infprmation dans la base de donnée */
    const updateclient = await prisma.client.update({
      where: { id },
      data: {
        name: data[0],
        phone: data[1],
        email: data[2],
        address: data[3],
        type: data[4],
      },
    });
    return res.status(201).json({
      success: true,
      message: 'client successfully updated!',
      updateclient,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise a jour!',
      error: error.message,
    });
  }
};

//DELETE CLIENT
exports.deleteClient = async (req, res, next) => {
  const id = req.params.id * 1;

  try {
    //**On verifie si le client existe dans la base de donnée */
    const client = await prisma.client.findUnique({
      where: { id },
    });
    if (!client) {
      return res
        .status(404)
        .json({ success: true, message: "Ce client n'existe pas!" });
    }
    await prisma.client.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'le client à été supprimer avec succes!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la suppression du client!',
      error,
    });
  }
};
