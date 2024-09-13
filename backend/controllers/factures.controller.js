/**********************************************/
/***********  Import external modules ******************/
const prisma = require('../config/prismaConfig');

// CREE UN FACTURE
exports.newFacture = async (req, res, next) => {
  const id = req.params.id * 1;
  const { matricule, description } = req.body;
  if (!matricule || !description) {
    return res
      .status(400)
      .json({ success: false, message: 'All field are required' });
  }

  const date = new Date();
  let year = date.getFullYear();

  try {
    //ON verifie si la facture existe dans la base de donnée
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Ce client n'existe pas!",
      });
    }
    //On initialise le numero de la facture
    const num = `FAC-${year}-`;

    // **on recuperer les factures de ce client */
    const clientFact = await prisma.facture.findMany({
      where: { clientId: id },
    });

    // Si le client n'a pas de facture on cree le premier facture pour ce clients
    if (clientFact.length === 0) {
      const numFacture = `${num}1`;
      //  **On enregistre le premier facture entreprice*/
      const newFacture = await prisma.facture.create({
        data: { numFacture, clientId: id, matricule, description },
      });
      return res.status(201).json({
        success: true,
        message: 'Le devis du client à été créer avec succes!',
        newFacture,
      });
    } else {
      //  Si le client a déja des facture
      //  On recuperer le numero de la derniere facture
      const lastFact = await prisma.facture.findMany({
        where: { clientId: id },
        orderBy: { createAt: 'desc' },
        select: { numFacture: true },
        take: 1,
      });
      //  **On incremente le dernier numero du derniere devis pour  */
      const numFacture = `${num}${parseInt(lastFact[0].numFacture[lastFact[0].numFacture.length - 1]) + 1}`;
      //  **On cree le devis suivant */
      const nextFacture = await prisma.facture.create({
        data: { numFacture, clientId: id, matricule, description },
      });
      return res.status(201).json({
        success: true,
        message: 'La facture du client à été créer avec succes!',
        nextFacture,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la création dela facture!',
      error: error.message,
    });
  }
};

// GET ALL FACTURE
exports.allFacture = async (req, res, next) => {
  try {
    const allFacture = await prisma.facture.findMany();
    if (allFacture.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'Aucune facture dans la basse de donnée!',
        quantity: allFacture.length,
        data: allFacture,
      });
    }
    return res
      .status(200)
      .json({ success: true, quantity: allFacture.length, data: allFacture });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la recupération des données!',
      error: error.message,
    });
  }
};

// GET ONE FACTURE
exports.oneFacture = async (req, res, next) => {
  const id = req.params.id * 1;
  try {
    const facture = await prisma.facture.findUnique({
      where: { id },
      include: {
        factureItem: {
          select: {
            itemId: true,
            description: true,
            quantity: true,
            unitePrice: true,
            total: true,
          },
        },
        clientFacture: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
          },
        },
      },
    });
    if (!facture) {
      return res.status(404).json({
        success: true,
        message: "Cette facture n'existe pas dans la base de donnée!",
      });
    }
    return res.status(200).json({ success: true, data: facture });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la recupération des données!',
      error: error.message,
    });
  }
};

// GET ALL CLIENT FACTURE
exports.allFactureClient = async (req, res, next) => {
  const id = req.params.id * 1; //ici id représente l'id du client
  try {
    //on verifie si le client existe
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Ce client n'existe pas!" });
    }
    //on chercher toutes les facture de ce client
    const clientFac = await prisma.facture.findMany({
      where: { clientId: id },
    });
    if (clientFac === 0) {
      return res.status(404).json({
        success: true,
        message: "Ce client n'a pas de facture dans la base de donnée!",
      });
    }
    //on Affiche toute les facture de ce drernier
    return res
      .status(200)
      .json({ success: true, quantity: clientFac.length, data: clientFac });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la recupération des données!',
      error: error.message,
    });
  }
};

// UPDATE ON FACTURE
exports.updateFacture = async (req, res) => {
  const { matricule, description } = req.body;
  const id = req.params.id * 1;
  try {
    //On verifie si la facture existe dans la basse de donné
    const facture = await prisma.facture.findUnique({ where: { id } });
    if (!facture) {
      return res
        .status(404)
        .json({ success: false, message: "Cette facture n'existe pas!" });
    }
    //on met a jour les données de la facture
    const upfact = await prisma.facture.update({
      where: { id },
      data: {
        matricule,
        description,
      },
    });
    return res.status(201).json({
      success: true,
      message: 'Facture Mis a jour avec succes',
      data: upfact,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la mis a jour des données!',
      error: error.message,
    });
  }
};
// DELETE ON FACTURE
exports.delFature = async (req, res) => {
  const id = req.params.id * 1;
  try {
    //on verifie si la facture existe
    const facture = await prisma.facture.findUnique({ where: { id } });
    if (!facture) {
      return res
        .status(404)
        .json({ success: false, message: "Cette facture n'existe pas!" });
    }
    //on supprime la facture
    await prisma.facture.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'La facture a été supprimer avec succes!',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la suppression des données!',
      error: error.message,
    });
  }
};
