module.exports = {
  async up(db) {
    db.createCollection("compare");
  },

  async down(db) {
    db.dropCollection("compare");
  },
};
