const { buildGPX, GarminBuilder } = require('gpx-builder');

const { Point } = GarminBuilder.MODELS;

const points = [
  new Point(33.516233, -86.80895, {
    name: 'AL, Birmingham - 911-0078',
    desc: '9/11 Liberty Garden Memorial',
    address: '300 19th St North',
  }),
  new Point(32.945564, -87.135493, {
    name: 'AL, Centreville - 911-0626',
    desc: 'Flag of Honor - Inside (2022 only)',
    address: '35 Ct Square E',
  }),
];

const gpxData = new GarminBuilder();

gpxData.setWayPoints(points);

function createGPXFile() {
  console.log('==== gpx.js Controller ====');
  console.log(buildGPX(gpxData.toObject()));
}

exports.createGPXFile = createGPXFile;
