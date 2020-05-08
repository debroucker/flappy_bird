window.onload = function(){
  var tailleTerrainHauteur = 600 - 30*3; //multiples de tailleBlock
  var tailleTerrainLargeur = 900; //idem
  var tailleBlock = 30;
  var delai = 130 ;
  var nbBlocksHauteurs = tailleTerrainHauteur/tailleBlock;
  var nbBlocksLargeurs = tailleTerrainLargeur/tailleBlock;
  var score = 0;
  var ctx;
  var score = 0;
  var nbEspace = 0;
  var gravite = 0.5;


  debutJeu();
  jeu();


  function debutJeu(){
    zoneJeu();
    oiseau = new Bird([4,12]); //creation oiseau
    creationPairBlock();
  }


  function graviteOiseau(g){
    if (oiseau.position[1] < nbBlocksHauteurs -1)
      oiseau.position[1] += g ;
  }


  function jeu(){
    ctx.clearRect(0,0, tailleTerrainLargeur, tailleTerrainHauteur);
    oiseau.dessin(); //appel a this.dessin = dessin du Bird
    blockBas.dessin();
    blockHaut.dessin();
    blockBas.avance();
    blockHaut.avance();
    if (blockBas.collision())
      alert("Perdu");
    else if (blockHaut.collision())
      alert("Perdu");
    else {
      graviteOiseau(gravite);
      //si sort du cadre, on le redessine
      if(blockHaut.position[0][0] == -1){
        creationPairBlock();
      }
      //gestion score
      if(blockHaut.position[0][0] == 2){
        score ++;
        changePointHtml();
        delai -= 2.5; //va plus vite
        gravite -= 0.015
      }
      setTimeout(jeu, delai) //execute la fonction jeu à chaque fois que le delai est passé
    }
  }


  function zoneJeu(){
    var terrain = document.createElement('canvas'); //creer elt de type canvas
    terrain.height = tailleTerrainHauteur; //hauteur
    terrain.width = tailleTerrainLargeur; //largeur
    terrain.style.border = "1px solid"; //type de bordure (pour mieux le voir)
    document.body.appendChild(terrain); //ajoute au html
    ctx = terrain.getContext('2d'); //dessiner dans le terrain (en 2 dimmensions)
  }


  function changePointHtml(){
    document.getElementById("score").innerHTML = score;
  }


  function changeNbEspaceHTML(){
    document.getElementById("nbEspace").innerHTML = nbEspace;
  }


  function creationPairBlock(){
    //creation d'un espace entre 2 blocks
    var espaceEntreBlocks = Math.round(Math.random()*5); //entre 2 et 5 blocks d'espaces
    if (espaceEntreBlocks < 3)
      espaceEntreBlocks = 3;
    //cration blockBas1 de longueur aleatoire
    var blockBasLen = Math.round( Math.random() * (nbBlocksHauteurs - espaceEntreBlocks - 1) +1 ); //taille du block de bas
    var blockListe = [];
    for(var i = 0; i < blockBasLen; i++)
      blockListe.push([nbBlocksLargeurs,nbBlocksHauteurs-1-i]);
    blockBas = new ObstacleBas(blockListe,blockBasLen); //creation blockBas1
    //cration blockHaut de longueur aleatoire
    var blockHautLen = Math.abs(nbBlocksHauteurs - blockBasLen - espaceEntreBlocks + 1);
    var blockListe = [];
    for(var i = 0; i < blockHautLen; i++)
      blockListe.push([nbBlocksLargeurs,i]);
  blockHaut = new ObstacleHaut(blockListe,blockHautLen); //creation blockHaut
}


  document.onkeydown = function handleKeyDown(e){ //gere evenement clavier
    var cle = e.keyCode; // detecte touche qu'on vient d'appuyer
    var nouvelleDirection;
    //code qui correspond a la barre espace
    if (cle == 32 && oiseau.position[1] >= 1){
      oiseau.position[1] --;
      nbEspace ++;
      changeNbEspaceHTML();

    }
  }


  function dessinBlock(ctx, position){ //position = une liste
    var x = position[0] * tailleBlock; //coordoné x
    var y = position[1] * tailleBlock; // coordoné y
    ctx.fillRect(x, y, tailleBlock, tailleBlock); //dessine block au coordoné x & y et de taille tailleBlock
  }


  function Bird(position){
    this.position = position; //liste
    this.dessin = function() { //dessine Bird
      ctx.save(); //sauvergarder contenu ctx
      ctx.fillStyle = "red"; //donner une couleur
      dessinBlock(ctx, this.position); //le dessiner
      ctx.restore(); //on réactualise ctx
    };
  }


  function ObstacleHaut(position, longueur){
    this.position = position; //liste
    this.len = longueur;
    this.dessin = function() { //dessine ObstacleBas1
      ctx.save(); //sauvergarder contenu ctx
      ctx.fillStyle = "green"; //donner une couleur
      for (e in this.position)
        dessinBlock(ctx, this.position[e]); //le dessiner
      ctx.restore(); //on réactualise ctx
    };
    this.avance = function(){
      for (e in this.position)
        this.position[e][0] --;
    };
    //this.position[0] => le 1er block en parant du haut
    this.collision = function(){
      if(3 <= this.position[0][0] && this.position[0][0] <= 4){
        if (this.position[0][1] + gravite <= oiseau.position[1] && oiseau.position[1] <= this.position[this.len-1][1] + gravite)
          return true;
      }
      return false;
    };
  }


  function ObstacleBas(position, longueur){
    this.position = position; //liste
    this.len = longueur;
    this.dessin = function() { //dessine ObstacleBas1
      ctx.save(); //sauvergarder contenu ctx
      ctx.fillStyle = "green"; //donner une couleur
      for (e in this.position)
        dessinBlock(ctx, this.position[e]); //le dessiner
      ctx.restore(); //on réactualise ctx
    };
    this.avance = function() {
      for (e in this.position)
        this.position[e][0] --;
    };
    this.collision = function(){
      //this.position[0] => le 1er block en parant du bas
      if(3 <= this.position[0][0] && this.position[0][0] <= 4){
        if (this.position[0][1] + gravite >= oiseau.position[1] && oiseau.position[1] >= this.position[this.len-1][1] - gravite )
          return true;
      }
      return false;
    };
  }

}
