class GameWorldScene extends Scene {
    create() {
        const story = this.engine.storyData;
        this.player = story.player || { location: story.start, inventory: [], flags: {} };
        story.player = this.player;

        const location = story.locations[this.player.location];
        this.engine.setTitle(location.title);
        this.engine.show(location.text);

        // Show items
        if (location.item && !hasItem(this.player, location.item)) {
            this.engine.show(`<em>You see a ${location.item} here.</em>`);
            this.engine.addChoice(`Take ${location.item}`, { take: location.item });
        }

        // Special scenes like the radio
        if (location.special === "radio") {
            this.engine.addChoice("Use the radio", { special: "radio" });
        }

        // Movement
        for (let choice of location.choices) {
            if (!choice.locked || canUnlock(choice, this.player)) {
                this.engine.addChoice(choice.text, { go: choice.target });
            } else {
                this.engine.show(`<em>The way to ${choice.target} is blocked.</em>`);
            }
        }

        // Game win check
        if (location.ending === "win") {
            this.engine.show("<strong>You have escaped the mine! You win!</strong>");
        }
    }

    handleChoice(action) {
        if (action.go) {
            this.player.location = action.go;
        } else if (action.take) {
            this.player.inventory.push(action.take);
        } else if (action.special === "radio") {
            this.engine.gotoScene(RadioRoom);
            return;
        }
        this.engine.gotoScene(GameWorldScene);
    }
}

class RadioRoom extends Scene {
    create() {
        this.engine.setTitle("Radio Room");
        const messages = [
            "Static hisses through the speaker...",
            "You hear a faint voice say, 'Don't go alone...'",
            "A fragment: '...blasting cap...equipment shed...'",
            "You hear your name whispered..."
        ];
        const index = Math.floor(Math.random() * messages.length);
        this.engine.show(`<em>${messages[index]}</em>`);
        this.engine.addChoice("Return", {});
    }

    handleChoice(action) {
        this.engine.gotoScene(GameWorldScene);
    }
}

Engine.load(GameWorldScene, "myStory.json");