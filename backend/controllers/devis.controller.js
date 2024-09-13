/**********************************************/
/***********  Import external modules ******************/
const prisma = require('../config/prismaConfig');

//CREER UN DEVIS
exports.newDevis = async (req, res, next) => {
  const { matricule, description } = req.body;
  if (!matricule || !description) {
    return res
      .status(400)
      .json({ success: false, message: 'All field are required' });
  }

  const id = req.params.id * 1;
  const date = new Date();
  let year = date.getFullYear();
  try {
    //**On verifie si le client existe*/
    const client = await prisma.client.findUnique({
      where: { id },
    });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Ce client n'existe pas!" });
    }
    const num = `DEVIS-${year}-`;
    // **on recuperer les devis de ce client */
    const clientDev = await prisma.devis.findMany({
      where: { clientId: client.id },
    });
    // Si le client n'a pas de devis on cree le premier devis pour ce clients
    if (clientDev.length === 0) {
      const numDevis = `${num}1`;
      //  **On enregistre le premier devis entreprice*/
      const newDevis = await prisma.devis.create({
        data: { numDevis, clientId: id, matricule, description },
      });
      return res.status(201).json({
        success: true,
        message: 'Le devis du client à été créer avec succes!',
        newDevis,
      });
    } else {
      //  Si le client a déja des devis
      //  On recuperer le numero du dernier devis
      const lastDev = await prisma.devis.findMany({
        where: { clientId: client.id },
        orderBy: { createAt: 'desc' },
        select: { numDevis: true },
        take: 1,
      });
      //  **On incremente le dernier numero du derniere devis pour  */
      const numDevis = `${num}${parseInt(lastDev[0].numDevis[lastDev[0].numDevis.length - 1]) + 1}`;
      //  **On cree le devis suivant */
      const nextDevis = await prisma.devis.create({
        data: { numDevis, clientId: id, matricule, description },
      });
      return res.status(201).json({
        success: true,
        message: 'Le devis du client à été créer avec succes!',
        nextDevis,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du devis!',
      error: error.message,
    });
  }
};

//ON AFFICHE TOUS LES DEVIS
exports.getAllDevis = async (req, res, next) => {
  try {
    const devis = await prisma.devis.findMany({
      orderBy: { createAt: 'desc' },
      include: {
        devisItem: {
          select: {
            description: true,
            quantity: true,
            unitePrice: true,
            total: true,
          },
        },
        clientDevis: {
          select: {
            name: true,
            phone: true,
            email: true,
            address: true,
          },
        },
      },
    });
    if (devis.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun devis dans la base de donnée!',
      });
    }
    return res.status(200).json({ success: true, devis });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: ' Erreur lors de la recherche des données!',
      error: error.message,
    });
  }
};

//ON AFFICHE UN DEVIS
exports.getOneDevis = async (req, res, next) => {
  const id = req.params.id * 1;
  try {
    //**On verifie si le devis existe */
    const devis = await prisma.devis.findUnique({
      where: { id },
      include: {
        devisItem: {
          select: {
            itemId: true,
            description: true,
            quantity: true,
            unitePrice: true,
            total: true,
          },
        },
        clientDevis: {
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
    if (!devis) {
      return res
        .status(404)
        .json({ success: true, message: "Ce devis n'existe pas!" });
    }
    return res.status(200).json({ success: true, devis });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la recherche des devis!',
      error: error.message,
    });
  }
};

//ON AFFICHE TOUS LES DEVIS D'UN CLIENT
exports.getAllDevisClient = async (req, res, next) => {
  const idClient = req.params.id * 1;
  try {
    //on verifie si le client existe
    const client = await prisma.client.findUnique({
      where: { id: idClient },
    });
    if (!client) {
      return res
        .status(404)
        .json({ success: true, message: "Ce client n'existe pas!" });
    }
    //On recupere les devis du client
    const devisClients = await prisma.devis.findMany({
      where: { clientId: idClient },
    });
    if (devisClients.length === 0) {
      return res
        .status(404)
        .json({ success: true, message: "Ce client n'a pas de devis!" });
    }

    return res.status(200).json({ success: true, devisClients });
  } catch (error) {
    return res.status(400).json({
      success: true,
      message: 'Erreur lors de la recherche des devis!',
      error: error.message,
    });
  }
};

//ON AFFICHE UN DEVIS D'UN CLIENT
exports.getOneDevisClient = async (req, res, next) => {
  const { idClient, devisId } = req.params;
  try {
    //on verifie si le client existe
    const client = await prisma.client.findUnique({
      where: { id: idClient },
    });
    if (!client) {
      return res
        .status(404)
        .json({ success: true, message: "Ce client n'existe pas!" });
    }

    //On recupere le devis du client
    const devis = await prisma.devis.findUnique({
      where: { id: devisId },
    });
    if (!devis) {
      return res
        .status(404)
        .json({ success: true, message: "Ce devis n'existe pas!" });
    }
    return res.status(200).json({ success: true, devis });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la recuperation des données!',
      error: error.message,
    });
  }
};

//ON MET A JOUR LES INFORMATIONS DU DEVIS
exports.updateDevis = async (req, res, next) => {
  const { matricule, description } = req.body;
  const id = req.params.id * 1;
  try {
    //on verifie si le devis existe!
    const devis = await prisma.devis.findUnique({
      where: { id },
    });
    if (!devis) {
      return res
        .status(404)
        .json({ success: true, message: "Ce devis n'existe pas!" });
    }

    //On met a jour le devis
    const updatedevis = await prisma.devis.update({
      where: { id },
      data: {
        matricule,
        description,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Le devis a été mis à jours avec success!',
      updatedevis,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour des données!',
      error: error.message,
    });
  }
};

//SUPRIMER UN DEVIS
exports.deleteDevis = async (req, res, next) => {
  const id = req.params.id * 1;
  try {
    //**on verifie si le devis existe */
    const devis = await prisma.devis.findUnique({
      where: { id },
    });
    if (!devis) {
      return res
        .status(404)
        .json({ success: true, message: "Ce devis n'existe pas!" });
    }
    //**On supprime le devis */
    await prisma.devis.delete({ where: { id } });
    return res
      .status(200)
      .json({ success: true, message: 'Devis supprimer avec succes!' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la suppression des données!',
      error: error.message,
    });
  }
};
