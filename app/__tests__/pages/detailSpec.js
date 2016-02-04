jest.dontMock('../../src/pages/detail');

import React from 'react';
import ReactDOM from 'react-dom';
import sd from 'skin-deep';
import mockRequest from 'superagent';

const Detail = require('../../src/pages/detail').default;

describe('Detail', () => {

    var detailPage, detail;


    fdescribe('calls to github fail', function () {
        beforeEach(function () {
            mockRequest.__setMockError({ error: 'error!' });

            detailPage = sd.shallowRender(<Detail />);
            detail = detailPage.getMountedInstance();
        });

        it('prints a message', function () {
            spyOn(console, 'error');

            detail.fetchFromGithub('error');
            expect(console.error).toHaveBeenCalledWith('There was an error fetching from Github', { error: 'error!' });
        });
    });


    describe('calls to github pass', function(){
        beforeEach(function () {
            mockRequest.__setMockResponse({body: []});
            spyOn(mockRequest, 'get').and.callThrough();
            detailPage = sd.shallowRender(<Detail />);
            detail = detailPage.getMountedInstance();
        });

        it('sets empty lists of commits, forks, and pulls and selects commits by default', () => {
            expect(detail.state.commits).toEqual([]);
            expect(detail.state.pulls).toEqual([]);
            expect(detail.state.forks).toEqual([]);
            expect(detail.state.selected).toEqual('commits');
        });

        describe('fetchFromGithub', () => {
            it('fetches the given type from facebook\'s react repo', () => {
                mockRequest.__setMockResponse({body: ['yo']});

                detail.fetchFromGithub('yo');
                expect(mockRequest.get).toHaveBeenCalledWith('https://api.github.com/repos/facebook/react/yo');
                expect(detail.state.yo).toEqual(['yo']);
            });
        });

        describe('clicking on \'see pull requests\' button fetches pull requests', function () {

        });
    });
});