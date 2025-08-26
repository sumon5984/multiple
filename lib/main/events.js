let commands = [];
function plugin(info, func) {
  commands.push({...info, function: func});
  return info;
}
module.exports = { plugin, commands };



