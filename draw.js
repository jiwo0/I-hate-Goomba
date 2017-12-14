const canvas = document.getElementById('panel');
const context = canvas.getContext('2d');

// 구현 해야할 것
// 1. 점수 ( 변수와 그 표시)
// 2. 플레이어와 다른 모양의 장애물
// 3. 여러 방향에서 날아오는 장애물

// const arr = []; // 리터럴
// const arr = new Array();

// const obj = {};
// const obj = new Object();

function GameObject(src, width, height) { //틀이 되는 함수
  this.x = canvas.width / 2 - 20;
  this.y = canvas.height - 50;
  this.image = new Image();
  this.image.src = src;
  this.width = width;
  this.height = height;

  this.alpha = 1;
  this.isObstacle = false;
}

const player = new GameObject('player.png', 40, 40);
const obstacle = new GameObject('goomba.png', 30, 30);
const bonus = new GameObject('heart.png', 30, 30);
const objectArray = [];
let objDirection = [];


objectArray.push(player);

// 1초마다 한번씩 실행
setInterval(function() {
  const newObstacle = new GameObject('goomba.png', 30, 30);
  const newDirection = parseInt(Math.random() * 3);
  objDirection.push(newDirection);
  objectArray.push(newObstacle);
  newObstacle.isObstacle = true;

  newObstacle.x = Math.random() * 440;
  newObstacle.y = -newObstacle.height;
}, 500);

const downKeys = {};

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  downKeys[event.code] = true;
}

function onKeyUp(event) {
  downKeys[event.code] = false;
}

window.requestAnimationFrame(run);

let gameover = false;
let score = 0;

function run() {
  let score = 0;
  if (gameover) return;

  context.fillStyle = 'pink';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < objectArray.length; ++i) {
    // 투명도
    let obj = objectArray[i];
    let test = objDirection[i];
    context.globalAlpha = obj.alpha;

    context.drawImage(obj.image,
      obj.x, obj.y,
      obj.width, obj.height);

    if (obj === player) {
      if (obj.x < 0) {
        obj.x = canvas.width;
      } else if (obj.x > canvas.width) {
        obj.x = 0;
      }
      if (obj.y < 0) {
        obj.y = canvas.height;
      } else if (obj.y > canvas.height) {
        obj.y = 0;
      }
      continue;
    }

    if (obj.x <= 0) {
      objDirection[i] = 0;
      test = 0;
    } else if (obj.x >= canvas.width) {
      objDirection[i] = 1;
      test = 1;
    }


    if (obj.isObstacle) {
      if (test == 0) {
        obj.x += 5;
        obj.y += 5;
      } else if (test == 1) {
        obj.x -= 5;
        obj.y += 5;
      } else if (test == 2) {
        obj.y += 5;
      }
    }
    if (obj.y >= canvas.width) {
      ++score;
    }
    if (checkCollision(player, obj)) {
      context.font = "20px Ariel";
      context.fillStyle = "white";
      context.fillText("GAME OVER", canvas.width / 2 - 50, canvas.height / 2);
      context.fill();
      gameover = true;
    }
  }

  console.log(score);
  context.font = "20px Ariel";
  context.fillStyle = "white";
  context.fillText("score :" + score, 40, 30);
  context.fill();


  if (downKeys['ArrowLeft'])
    player.x -= 10;
  if (downKeys['ArrowRight'])
    player.x += 10;
  if (downKeys['ArrowUp'])
    player.y -= 10;
  if (downKeys['ArrowDown'])
    player.y += 10;

  window.requestAnimationFrame(run);
}


function remove(array, element) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}



function checkCollision(a, b) {
  // 충돌체크 짜기
  // a와 b가 충돌했으면 true, 아니면 false 반환
  return !(a.x > b.x + b.width ||
    a.x + a.width < b.x ||
    a.y > b.y + b.height ||
    a.y + a.height < b.y
  );
}
