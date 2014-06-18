var tools = require('./tools');
var gameInterface = {};

// 送信データ作成
gameInterface.makeSendData = function(obj, datatype){
  var sendData = {};
  switch(datatype){
  	case 'object':
    case 'gaol':
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
      sendData.picture = obj.m_userData.picture;
      sendData.userType = obj.m_userData.userType;
      if(obj.m_contactList){
      	sendData.collision = 1;
      }
  	  break;
  	default:
  	  break;

  }
  return sendData;
};

module.exports = gameInterface;
