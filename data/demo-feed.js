// Demo mode: a canned Gemini generateContent response for the weekend of Saturday, September 26, 2026,
// in the exact shape the live call returns. Used when no API key is saved.
// Results are real (Sep 25-27); the reasons are written for the demo. Games are ranked from
// "everyone will talk about this" down to "quiet game, skip unless you are bored".

export const DEMO_FEED_DATE = '2026-09-26';

export const DEMO_CIRCLES = [
  { name: 'College friends', sports: ['NFL', 'CFB'], teams: { NFL: ['49ers', 'Rams'], CFB: ['Cal'] } },
  { name: 'Coworkers', sports: ['MLB', 'NFL'], teams: { MLB: ['Dodgers', 'Giants'], NFL: ['Raiders'] } },
];

const BOTH = ['Coworkers', 'College friends'];
const COLLEGE = ['College friends'];
const WORK = ['Coworkers'];

const game = (sport, date, a, b, circles, reason) => ({
  sport, date, teams: [{ name: a[0], score: a[1] }, { name: b[0], score: b[1] }], circles, reason,
});

const games = [
  // Everyone will talk about these
  game('MLB', '2026-09-27', ['Los Angeles Dodgers', 5], ['San Francisco Giants', 1], BOTH,
    'The Dodgers swept the Giants to close out the season, so this is the one everybody will bring up, at work and in the group chat.'),
  game('NFL', '2026-09-27', ['San Francisco 49ers', 36], ['Arizona Cardinals', 30], BOTH,
    'The 49ers are 3-0 after Brock Purdy threw four touchdowns, and your college friends and your coworkers will both want to talk about it.'),
  game('NFL', '2026-09-27', ['Baltimore Ravens', 34], ['Dallas Cowboys', 31], BOTH,
    'An instant classic in Rio that came down to the last minute. Everyone saw the clips, so expect it to come up no matter who you are with.'),

  // One circle really cares
  game('NFL', '2026-09-27', ['Las Vegas Raiders', 35], ['New Orleans Saints', 27], WORK,
    'The Raiders pulled away in the fourth quarter to go 3-0, and your coworkers will want to talk about it first thing.'),
  game('CFB', '2026-09-25', ['Clemson Tigers', 24], ['California Golden Bears', 10], COLLEGE,
    'Cal had Clemson at home on a Friday night and the offense just disappeared. Your college friends will not stop talking about this one.'),
  game('NFL', '2026-09-27', ['Denver Broncos', 30], ['Los Angeles Rams', 26], COLLEGE,
    'The Rams blew a 16-point lead in Denver, so your college friends who root for LA are going to need to vent.'),
  game('CFB', '2026-09-26', ['Oregon Ducks', 41], ['USC Trojans', 27], COLLEGE,
    'Oregon lost its starting QB to a concussion and still dropped 41 on USC, so your college friends are going to be asking who that backup is.'),
  game('CFB', '2026-09-26', ['Wisconsin Badgers', 24], ['Penn State Nittany Lions', 20], COLLEGE,
    'Wisconsin scored twice at the very end to knock off Penn State. Expect this upset to blow up the college friends group chat.'),
  game('MLB', '2026-09-27', ['Minnesota Twins', 6], ['Texas Rangers', 4], WORK,
    'The Rangers lost on the last day of the season and missed the playoffs, so your coworkers who follow baseball will be talking about how it ended.'),
  game('MLB', '2026-09-27', ['Houston Astros', 9], ['Athletics', 0], WORK,
    'The other half of the Rangers story: the Astros shut out the A\'s on the final day, and your baseball coworkers will mention them in the same breath.'),
  game('CFB', '2026-09-26', ['Texas Longhorns', 20], ['Tennessee Volunteers', 17], COLLEGE,
    "No. 1 Texas barely got out of this one alive, so get ready for your college friends to start the 'Texas is overrated' debate."),

  // Only some people will care
  game('GOLF', '2026-09-27', ['United States', 17], ['International', 13], WORK,
    'Only your coworkers who golf will care, but the U.S. was behind going into Sunday and came back in singles to win the Presidents Cup again.'),
  game('SOCCER', '2026-09-27', ['Columbus Crew', 2], ['Inter Miami CF', 1], WORK,
    'Nobody in your circles really follows MLS, but Messi scored a free kick and Miami still lost, so it might come up.'),
  game('CFB', '2026-09-26', ['Ohio State Buckeyes', 42], ['Illinois Fighting Illini', 19], COLLEGE,
    'Only matters if your college friends follow the Heisman race: Jeremiah Smith caught four touchdowns.'),
  game('NFL', '2026-09-27', ['Buffalo Bills', 24], ['Los Angeles Chargers', 16], WORK,
    'The Bills turned it over five times and still beat the Chargers, which your Raiders coworkers will happily point out about their division rival.'),
  game('NFL', '2026-09-27', ['Kansas City Chiefs', 24], ['Miami Dolphins', 10], WORK,
    "Only your Raiders coworkers will care: the Chiefs handled Miami easily, and they're the team the Raiders have to keep ahead of."),
  game('CFB', '2026-09-26', ['Georgia Bulldogs', 41], ['Oklahoma Sooners', 13], COLLEGE,
    'A blowout, so it only comes up if one of your college friends is an SEC fan.'),
  game('CFB', '2026-09-26', ['Notre Dame Fighting Irish', 49], ['Purdue Boilermakers', 10], COLLEGE,
    'Notre Dame rolled like everyone expected. Worth a look only if someone in the group is a Notre Dame fan.'),

  // Quiet games: skip unless you are bored
  game('SOCCER', '2026-09-26', ['San Jose Earthquakes', 3], ['Portland Timbers', 1], COLLEGE,
    'Preston Judd scored twice for San Jose, but this is a quiet one. Skip it unless you are bored.'),
  game('CFB', '2026-09-26', ['Texas Tech Red Raiders', 49], ['Sam Houston Bearkats', 14], COLLEGE,
    'Fun fact if it comes up: a Texas Tech linebacker returned two interceptions for touchdowns. Otherwise, skip.'),
  game('NFL', '2026-09-27', ['New York Giants', 12], ['Tennessee Titans', 7], WORK,
    'A 12-7 game. Nobody is going to ask you about this one, so skip it unless you are really bored.'),
  game('MLB', '2026-09-27', ['Seattle Mariners', 7], ['Los Angeles Angels', 3], WORK,
    'A quiet final-day game. Safe to skip.'),
  game('CFB', '2026-09-26', ['Houston Cougars', 42], ['Georgia Southern Eagles', 28], COLLEGE,
    "Nobody in your circles is going to bring this one up. Skip unless you're bored."),
  game('CFB', '2026-09-26', ['Miami Hurricanes', 52], ['Central Michigan Chippewas', 3], COLLEGE,
    'The score says it all: 52-3. You can skip this one.'),
];

export const DEMO_RESPONSE = {
  candidates: [{
    content: { role: 'model', parts: [{ text: JSON.stringify({ games }) }] },
    finishReason: 'STOP',
    groundingMetadata: {
      webSearchQueries: [
        'NFL week 3 scores September 27 2026',
        'college football scores September 26 2026',
        'MLB final day scores September 27 2026 playoff race',
        'Presidents Cup 2026 result',
        'MLS scores September 26 27 2026',
      ],
    },
  }],
  modelVersion: 'gemini-3.8-flash',
};
