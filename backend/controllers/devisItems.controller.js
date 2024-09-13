/**********************************************/
/***********  Import external modules ******************/
const prisma = require('../config/prismaConfig');

//ON CREE UNE NOUVELLE LIGNE DANS UN DEVIS
exports.addDevisItem = async (req, res) => {
  const { description, quantity, prix } = req.body;
  const descriptionItem = description.toUpperCase().trim();
  const id = req.params.id * 1;

  try {
    //on verifie si le devis existe
    const devis = await prisma.devis.findUnique({ where: { id } });
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: "Ce devis n'existe pas!",
      });
    }

    //on ajoute la ligne
    const itemline = await prisma.itemsDevis.create({
      data: {
        devisId: devis.id,
        description: descriptionItem,
        quantity,
        unitePrice: prix,
        total: quantity * prix,
      },
    });

    //**On met a jour le total de la devis */
    await prisma.devis.update({
      where: { id: devis.id },
      data: {
        total: devis.total + itemline.total,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Article ajouter avec success!',
      article: itemline,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la ligne!',
      error: error.message,
    });
  }
};

//ON MET A JOUR UNE LIGNE DANS UN DEVIS
exports.updateDevisItem = async (req, res) => {
  const { description, quantity, unitePrice } = req.body;
  const descriptionItem = description.toUpperCase().trim();
  const id = req.params.id * 1;

  try {
    //**On verifie si la ligne existe */
    const ligneItem = await prisma.itemsDevis.findUnique({
      where: { itemId: id },
    });
    if (!ligneItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cet article n'existe pas!" });
    }

    //**On verifie si le devis exsite*/
    const devis = await prisma.devis.findUnique({
      where: { id: ligneItem.devisId },
    });
    if (!devis) {
      return res
        .status(404)
        .json({ success: false, message: "Ce devis n'existe pas!" });
    }

    //ON retire le total de la ligne du total devis

    await prisma.devis.update({
      where: { id: ligneItem.devisId },
      data: { total: devis.total - ligneItem.total },
    });

    //**On met a jour la ligne */
    const updateItem = await prisma.itemsDevis.update({
      where: { itemId: id },
      data: {
        description: descriptionItem,
        quantity,
        unitePrice,
        total: quantity * unitePrice,
      },
    });

    //**On met a jour le total de la devis */
    const totalDevis = await prisma.itemsDevis.aggregate({
      _sum: {
        total: true,
      },
    });

    await prisma.devis.update({
      where: { id: devis.id },
      data: {
        total: totalDevis._sum.total,
      },
    });
    return res.status(201).json({ success: true, data: updateItem });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise a jour de la ligne!',
      error: error.message,
    });
  }
};

//ON SUPPRIME UNE LIGNE DANS UN DEVIS
exports.deleteDevisItem = async (req, res) => {
  const id = req.params.id * 1;
  try {
    //**On verifie si la ligne existe */
    const ligneItem = await prisma.itemsDevis.findUnique({
      where: { itemId: id },
    });
    if (!ligneItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cet article n'existe pas!" });
    }

    //**On verifie si le devis exsite*/
    const devis = await prisma.devis.findUnique({
      where: { id: ligneItem.devisId },
    });
    if (!devis) {
      return res
        .status(404)
        .json({ success: false, message: "Ce devis n'existe pas!" });
    }

    //**on Met a jour le total du devis */
    await prisma.devis.update({
      where: { id: ligneItem.devisId },
      data: {
        total: devis.total - ligneItem.total,
      },
    });

    //On Supprime la ligne
    await prisma.itemsDevis.delete({ where: { itemId: id } });
    return res
      .status(200)
      .json({ success: true, message: 'Article supprimer avec success' });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la suppresssion des données!',
      error: error.message,
    });
  }
};

//ON SUPPRIME TOUTE LES LIGNE DU DEVIS
exports.deleteAllDevisItem = async (req, res) => {
  const id = req.params.id * 1;
  try {
    //**On verifie si la devis exsite*/
    const devis = await prisma.devis.findUnique({
      where: { id },
    });
    if (!devis) {
      return res
        .status(404)
        .json({ success: false, message: "Ce devis n'existe pas!" });
    }

    //**On met a jour le total de la devis */
    await prisma.devis.update({
      where: { id: devis.id },
      data: {
        total: 0,
      },
    });

    //**on suprime toute les ligne */
    await prisma.itemsDevis.deleteMany({
      where: { devisId: id },
    });
    return res
      .status(200)
      .json({
        success: true,
        message: 'les articles du devis ont été supprimer avec success!',
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la suppresssion des données!',
      error: error.message,
    });
  }
};
