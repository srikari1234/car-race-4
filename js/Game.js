class Game {
  constructor(){

  }

  //getting the gameState info from the firebase database

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  //updates the gameState
  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  //starts the game

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }


    //creating the cars and adding the animation

    car1 = createSprite(100,200);
    car1.addImage("car1", car1_img);
    car2 = createSprite(300,200);
    car2.addImage("car2", car2_img);
    car3 = createSprite(500,200);
    car3.addImage("car3", car3_img);
    car4 = createSprite(700,200);
    car4.addImage("car4", car4_img);
    cars = [car1, car2, car3, car4];
  }

  //play the game and mark the car 

  play(){
    form.hide();

    Player.getPlayerInfo();
    player.getCarsAtEnd();

    
    if(allPlayers !== undefined){
      background("#c68767");
      image(track,0,-displayHeight*4,displayWidth,displayHeight*5)
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 175;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        //console.log(allPlayers[plr].distance);
        cars[index-1].x = x;
        cars[index-1].y = y;

        if (index === player.index){
          stroke(10);
          fill("yellow");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    if(player.distance === 3700){
      gameState = 2;
      player.rank = player.rank + 1;
      Player.updateCarsAtEnd(player.rank);
      
      
    }

    if(player.distance >= 3700){
      text("Your Rank is: "+ player.rank, displayWidth/2, y-150);
      console.log(player.rank);
    }
    drawSprites();
  }

  //ending the game with game state 2

  end(){
    console.log("gameEnded");
    game.update(2);
    

  }

}