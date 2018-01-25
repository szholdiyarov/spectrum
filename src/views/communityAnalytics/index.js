// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import { getCommunityById } from 'shared/graphql/queries/community/getCommunity';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import { openModal } from '../../actions/modals';
import ViewError from '../../components/viewError';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import { Button, OutlineButton, ButtonRow } from '../../components/buttons';
import MemberGrowth from './components/memberGrowth';
import ConversationGrowth from './components/conversationGrowth';
import TopMembers from './components/topMembers';
import TopAndNewThreads from './components/topAndNewThreads';
import {
  SectionsContainer,
  Column,
} from '../../components/settingsViews/style';
import { Loading } from '../../components/loading';

type Props = {
  currentUser: Object,
  data: {
    community: GetCommunityType,
  },
  communitySlug: string,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Function,
  match: Object,
};

type State = {
  timeframe: 'weekly' | 'monthly',
};

class CommunityAnalytics extends React.Component<Props, State> {
  upgrade = () => {
    const { dispatch, currentUser, data: { community } } = this.props;
    dispatch(
      openModal('COMMUNITY_UPGRADE_MODAL', { user: currentUser, community })
    );
  };

  render() {
    const { data: { community }, isLoading } = this.props;

    if (community && community.id) {
      if (!community.isPro) {
        return (
          <ViewError
            emoji={'💪'}
            heading={'Supercharge your community with Spectrum Analytics.'}
            subheading={
              'To explore analytics for your community, unlock private channels, add multiple moderators, and more, please upgrade to the standard plan.'
            }
          >
            <ButtonRow>
              <Button onClick={this.upgrade} large>
                Upgrade to Standard
              </Button>
            </ButtonRow>
          </ViewError>
        );
      }

      return (
        <SectionsContainer>
          <Column>
            <MemberGrowth id={community.id} />
            <TopMembers id={community.id} />
          </Column>
          <Column>
            <ConversationGrowth id={community.id} />
            <TopAndNewThreads id={community.id} />
          </Column>
        </SectionsContainer>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <ViewError
        heading={'You don’t have permission to manage this community.'}
        subheading={
          'If you want to create your own community, you can get started below.'
        }
      >
        <ButtonRow>
          <Link to={'/'}>
            <OutlineButton large>Take me back</OutlineButton>
          </Link>

          <Link to={'/new/community'}>
            <Button large>Create a community</Button>
          </Link>
        </ButtonRow>
      </ViewError>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map),
  getCommunityById,
  viewNetworkHandler
)(CommunityAnalytics);
