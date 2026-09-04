exports.up = (pgm) => {
  pgm.addColumn("users", {
    features: {
      type: "varchar[]",
      noNull: true,
      default: "{}",
    },
  });
};

exports.down = false;
