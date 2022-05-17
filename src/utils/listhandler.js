const updateListWithParams = (
  modelList,
  votesData,
  userVotes,
  flaggedModels
) => {
  if (modelList && modelList.length > 0) {
    modelList.forEach((perModel) => {
      const voteData = votesData.find((it) => it[perModel._id]);
      perModel.isVoted = userVotes ? userVotes.includes(perModel._id) : false;
      const flaggedModel = flaggedModels
        ? flaggedModels.find((it) => it[perModel._id])
        : null;
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
