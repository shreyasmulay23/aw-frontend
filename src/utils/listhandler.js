const updateListWithParams = (
  modelList,
  votesData,
  userVotes,
  flaggedModels
) => {
  if (modelList && modelList.length > 0) {
    modelList.forEach((perModel) => {
      const voteData = votesData.find((it) => it[perModel._id]);
      perModel.isVoted = userVotes.includes(perModel._id);
      const flaggedModel = flaggedModels.find((it) => it[perModel._id]);
      perModel.isFlagged = false;
      perModel.flagReason = "";
      if (flaggedModel) {
        perModel.isFlagged = true;
        perModel.flagReason = flaggedModel[perModel._id];
      }
      perModel.upVotes = 0;
      if (voteData) {
        perModel.upVotes = voteData[perModel._id];
      }
    });
  }
};

export const listHandler = { updateListWithParams };
