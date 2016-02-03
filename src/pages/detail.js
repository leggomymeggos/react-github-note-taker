import React from 'react';
import request from 'superagent';

class Detail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            commits: [],
            forks: [],
            pulls: [],
            selected: 'commits'
        };
    }

    componentWillMount() {
        this.fetchFromGithub('commits');
        this.fetchFromGithub('forks');
        this.fetchFromGithub('pulls');
    }

    fetchFromGithub(type) {
        request.get('https://api.github.com/repos/facebook/react/' + type)
            .end((error, response) => {
                if (!error && response) {
                    this.setState({[type]: response.body});
                } else {
                    console.error('There was an error fetching from Github', error);
                }
            });

    }

    renderForks() {
        return this.state.forks.map((fork, index) => {
            var author = fork.owner ? fork.owner.login : 'Anonymous';
            var htmlUrl = fork.html_url ? fork.html_url : '';
            return (<p key={index}>
                    <strong>
                        <a href={htmlUrl}>{author}</a>
                    </strong>'s fork of {fork.name}
                </p>
            )
        })
    };

    renderCommits() {
        return this.state.commits.map((commit, index) => {
            var author = commit.author ? commit.author.login : 'Anonymous';
            var htmlUrl = commit.html_url ? commit.html_url : '';
            var message = commit.commit ? commit.commit.message : 'There is no message associated with this commit';
            return Detail.basicRenderTemplate(index, author, htmlUrl, message);
        });
    };

    renderPullRequests() {
        return this.state.pulls.map((pullRequest, index) => {
            var author = pullRequest.user ? pullRequest.user.login : 'Anonymous';
            var htmlUrl = pullRequest.html_url ? pullRequest.html_url : '';
            var title = pullRequest.title ? pullRequest.title : 'There is no title for this pull request';
            return Detail.basicRenderTemplate(index, author, htmlUrl, title);
        })
    };

    static basicRenderTemplate(index, author, htmlUrl, description) {
        return (<p key={index}>
                <strong>{author}</strong>
                <a href={htmlUrl}>{description}</a>
            </p>
        );
    }

    setSelected(selected){
        this.setState({ selected });
    }

    renderSelected() {
        switch (this.state.selected) {
            case 'commits':
                return this.renderCommits();
                break;
            case 'forks':
                return this.renderForks();
                break;
            case 'pull requests':
                return this.renderPullRequests();
                break;
        }
    }

    render() {
        return (<div>
            {this.renderSelected()}
            <button onClick={this.setSelected.bind(this, 'commits')}>See Commits</button>
            <button onClick={this.setSelected.bind(this, 'pull requests')}>See Pull Requests</button>
            <button onClick={this.setSelected.bind(this, 'forks')}>See Forks</button>
        </div>)
    }
}

export default Detail;