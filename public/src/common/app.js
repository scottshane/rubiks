const app = {
    componentList: [],
    initComponents() {
        this.componentList.forEach( component => {
            component.init();
        });
    }
};

module.exports = app;
