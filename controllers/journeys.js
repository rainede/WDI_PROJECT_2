const Journey = require('../models/journey');
const polyline = require('polyline');

module.exports = {
  index: journeysIndex,
  new: journeysNew,
  show: journeysShow,
  update: journeysUpdate,
  delete: journeysDelete
};

function journeysIndex(req, res) {
  Journey.find((err, journeys) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json({ journeys });
  });
}

function journeysNew(req, res) {
  console.log('journeys New');
//  polyline.decode('}qpwFxdsbM`D|@z@wClA_EiCw@qCs@_@K}EsAaIuBoAYf@eBpF{Pv@eCaC}AkJiGuBuAyBwA~@wC')
//polyline.decode(req.params.
  return res.status(200).json({message: 'OK'});
}
function journeysShow(req, res) {
  Journey.findById(req.params.id, (err, journey) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!journey) return res.status(404).json({ message: 'Journey not found.' });
    return res.status(200).json({ journey });
  });
}

function journeysUpdate(req, res) {
  Journey.findByIdAndUpdate(req.params.id, req.body.journey, { new: true },  (err, journey) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!journey) return res.status(404).json({ message: 'Journey not found.' });
    return res.status(200).json({ journey });
  });
}

function journeysDelete(req, res) {
  Journey.findByIdAndRemove(req.params.id, (err, journey) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!journey) return res.status(404).json({ message: 'Journey not found.' });
    return res.status(204).send();
  });
}
