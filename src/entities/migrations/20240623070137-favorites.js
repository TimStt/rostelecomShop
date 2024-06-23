module.exports = {
  async up(db, client) {
    db.createCollection("favorites");
  },

  async down(db, client) {
    db.dropCollection("favorites");
  },
};
