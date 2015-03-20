var tools = require('./tools');

var gameInterface = {};

// 送信データ作成
gameInterface.makeSendData = function(obj, datatype, picture){
  var sendData = {};
  switch(datatype){
    case 'object':
    case 'goal':
      var position = obj.GetPosition();
      var angle = obj.GetAngle();
      var vPos = tools.b2v(position.x, position.y, angle);
      sendData.x = vPos.x.toFixed(3);
      sendData.y = vPos.y.toFixed(3);
      sendData.angle = vPos.angle.toFixed(3);
      sendData.id = obj.m_userData.id;
      sendData.texture = obj.m_userData.texture;
      sendData.datatype = datatype;
      break;

    case 'player':
    case 'you':
      var position = obj.GetPosition();
      var angle = obj.GetAngle();
      var vPos = tools.b2v(position.x, position.y, angle);
      sendData.x = vPos.x.toFixed(3);
      sendData.y = vPos.y.toFixed(3);
      sendData.angle = vPos.angle.toFixed(3);
      sendData.id = obj.m_userData.id;
      sendData.texture = obj.m_userData.texture;
      sendData.datatype = datatype;
      sendData.name = obj.m_userData.name;
//      sendData.picture = obj.m_userData.picture;
      sendData.userType = obj.m_userData.userType;
      if(obj.m_contactList){
        sendData.collision = 1;
      }
      if(picture){
        sendData.picture = picture;
      }
      break;

    case 'bestTime':
      sendData.time = tools.getFormattedTime(obj.time);
      sendData.userName = obj.userName;
      sendData.userType = obj.userType;
      sendData.datatype = datatype;
      break;

    case 'time':
      sendData.time = tools.getFormattedTime(obj.time);
      sendData.datatype = datatype;
      break;

    default:
      break;

  }
  return sendData;
};

gameInterface.makeSendDeleteData = function(obj, datatype){
  var sendData = {};
  sendData.x = -100.0;
  sendData.y = -100.0;
  sendData.angle = 0.0;
  sendData.id = obj.m_userData.id;
  sendData.delflag = 1;
  sendData.datatype = datatype;
  return sendData;
};

module.exports = gameInterface;
