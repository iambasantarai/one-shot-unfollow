import { IgApiClient, IgLoginBadPasswordError } from 'instagram-private-api';

const ig = new IgApiClient();

export async function loginHandler(req, res) {
  const { username, password } = req.body;
  ig.state.generateDevice(username);
  ig.simulate.preLoginFlow();

  try {
    const loggedInUser = await ig.account.login(username, password);

    const following = await ig.feed.accountFollowing().items();

    return res.render('unfollow', {
      username: loggedInUser.username,
      followingCount: Object.entries(following).length,
    });
  } catch (error) {
    if (error instanceof IgLoginBadPasswordError) {
      return res.redirect('/', {
        message: error.response.body.message,
      });
    }
    console.log('ERROR: ', error);
  }
}

export async function unfollowHandler(_req, res) {
  try {
    const following = await ig.feed
      .accountFollowing(ig.state.cookieUserId)
      .items();

    for (const followee of following) {
      await ig.friendship.destroy(followee.pk);
    }

    return res.redirect('/unfollow');
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

export async function logoutHandler(_req, res) {
  try {
    await ig.account.logout();

    return res.redirect('/');
  } catch (error) {
    console.log('ERROR: ', error);
  }
}
