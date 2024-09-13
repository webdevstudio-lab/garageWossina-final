/**********************************************/
/***********  Import external modules ******************/
const prisma = require('../config/prismaConfig');

//ON CREE UNE NOUVELLE LIGNE DANS UNE FACTURE
exports.addFactureItem = async (req, res) => {
  const { description, quantity, prix } = req.body;
  const descriptionItem = description.toUpperCase().trim();
  const id = req.params.id * 1;

  try {
    //on verifie si le facture existe
    const facture = await prisma.facture.findUnique({ where: { id } });
    if (!facture) {
      return res.status(404).json({
        success: false,
        message: "Cette facture n'existe pas!",
      });
    }

    //on ajoute la ligne
    const itemline = await prisma.itemsFacture.create({
      data: {
        factureId: facture.id,
        description: descriptionItem,
        quantity,
        unitePrice: prix,
        total: quantity * prix,
      },
    });

    //**On met a jour le total de la facture */
    await prisma.facture.update({
      where: { id: facture.id },
      data: {
        total: facture.total + itemline.total,
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

//ON MET A JOUR UNE LIGNE DANS UNE FACTURE
exports.updateFactureItem = async (req, res) => {
  const { description, quantity, unitePrice } = req.body;
  const descriptionItem = description.toUpperCase().trim();
  const id = req.params.id * 1;

  try {
    //**On verifie si la ligne existe */
    const ligneItem = await prisma.itemsFacture.findUnique({
      where: { itemId: id },
    });
    if (!ligneItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cet article n'existe pas!" });
    }

    //**On verifie si le facture exsite*/
    const facture = await prisma.facture.findUnique({
      where: { id: ligneItem.factureId },
    });
    if (!facture) {
      return res
        .status(404)
        .json({ success: false, message: "Ce facture n'existe pas!" });
    }

    //ON retire le total de la ligne du total facture

    await prisma.facture.update({
      where: { id: ligneItem.factureId },
      data: { total: facture.total - ligneItem.total },
    });

    //**On met a jour la ligne */
    const updateItem = await prisma.itemsFacture.update({
      where: { itemId: id },
      data: {
        description: descriptionItem,
        quantity,
        unitePrice,
        total: quantity * unitePrice,
      },
    });

    //**On met a jour le total de la facture */
    const totalFacture = await prisma.itemsFacture.aggregate({
      _sum: {
        total: true,
      },
    });

    await prisma.facture.update({
      where: { id: facture.id },
      data: {
        total: totalFacture._sum.total,
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

//ON SUPPRIME UNE LIGNE DANS UNE FACTURE
exports.deleteFactureItem = async (req, res) => {
  const id = req.params.id * 1;
  try {
    //**On verifie si la ligne existe */
    const ligneItem = await prisma.itemsFacture.findUnique({
      where: { itemId: id },
    });
    if (!ligneItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cet article n'existe pas!" });
    }

    //**On verifie si le facture exsite*/
    const facture = await prisma.facture.findUnique({
      where: { id: ligneItem.factureId },
    });
    if (!facture) {
      return res
        .status(404)
        .json({ success: false, message: "Ce facture n'existe pas!" });
    }

    //**on Met a jour le total du facture */
    await prisma.facture.update({
      where: { id: ligneItem.factureId },
      data: {
        total: facture.total - ligneItem.total,
      },
    });

    //On Supprime la ligne
    await prisma.itemsFacture.delete({ where: { itemId: id } });
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

//ON SUPPRIME TOUTE LES LIGNE DU facture
exports.deleteAllFactureItem = async (req, res) => {
  const id = req.params.id * 1;
  try {
    //**On verifie si la facture exsite*/
    const facture = await prisma.facture.findUnique({
      where: { id },
    });
    if (!facture) {
      return res
        .status(404)
        .json({ success: false, message: "Cette facture n'existe pas!" });
    }

    //**On met a jour le total de la facture */
    await prisma.facture.update({
      where: { id: facture.id },
      data: {
        total: 0,
      },
    });

    //**on suprime toute les ligne */
    await prisma.itemsFacture.deleteMany({
      where: { factureId: id },
    });
    return res.status(200).json({
      success: true,
      message: 'les articles du facture ont été supprimer avec success!',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de la suppresssion des données!',
      error: error.message,
    });
  }
};
