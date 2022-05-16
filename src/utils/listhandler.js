const updateListWithVotes = (modelList, votesData) => {
  if (modelList.length && votesData.length > 0) {
    modelList.forEach((perModel) => {
      const voteData = votesData.find((it) => it[perModel._id]);
      perModel.upVotes = 0;
      if (voteData) {
        perModel.upVotes = voteData[perModel._id];
      }
    });
  }
};

export const listHandler = { updateListWithVotes };
