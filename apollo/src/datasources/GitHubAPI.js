const { GraphQLDataSource } = require('apollo-datasource-graphql');
const { repoByOrgReducer, sparklineReducer } = require('./reducers/GitHubReducer');
const { REPOS_BY_ORG, SPARKLINE, SPARKLINE_BY_DATE } = require('./queries/GitHubQueries');


class GitHubAPI extends GraphQLDataSource {
  baseURL = 'https://api.github.com/graphql';
  token = 'bearer cdf9e6076522e639c93c493448b1f02bb403b94b'; //token needs to be updated to Lambda-School-Labs token

  willSendRequest(request) {
    if (!request.headers) {
      request.headers = {};
    }

    request.headers.Authorization = `${this.token}`;
  }

  async getReposByOrg(dynamicQuery) {
    try {
      const res = await this.query(REPOS_BY_ORG, {
        variables: {
          dynamicQuery,
        },
      });
      return res.data.search.edges.map(repo => (
        repoByOrgReducer(repo)
      ));
    } catch (err) {
      console.log('getReposByOrg ERROR:', err);
    }
  }

  async getSparkline() {
    try {
      const res = await this.query(SPARKLINE);

      const lineofspark = res.data.repository.defaultBranchRef.target.history.nodes;
      return lineofspark.map(spark => (
        sparklineReducer(spark)
      ));
    } catch (err) {
      console.log('getSparkline ERROR:', err);
    }
  }

}

module.exports = GitHubAPI;
