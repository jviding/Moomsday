KillMuumi.IntroState = function() {};

KillMuumi.IntroState.prototype = {
    /*
     * Peli luodaan tiedostojen lataamisen jälkeen tässä
     */
    create: function() {
        this.text = this.add.text(this.world.centerX, 
                                  this.world.centerY, 
                                  "KillMuumi\nVuosisadan Muumitapposimulaattori",
                                {
                                    font: "24px",
                                    align: "center",
                                    fill: "white"
                                });
                                
        this.text2 = this.add.text(this.world.centerX,
                                  this.world.centerY + 200,
                                  "Paina X aloittaaksesi",
                                  {
                                      font: "36px",
                                      align: "center",
                                      fill: "white"
                                  });
                                
        this.text.anchor.setTo(0.5, 0.5);
        this.text2.anchor.setTo(0.5, 0.7);
    },

    /*
     * Peliä päivitetään n. 60 kertaa sekunnissa tässä
     */
    update: function() {
        if (this.input.keyboard.isDown(Phaser.KeyCode.X)) {
            startGame();
        }
    }
};