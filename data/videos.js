// Sample ESPN videos published 2026-09-21 through 2026-09-27, built around real results from that week.
// youtubeId: a real highlight of that game on YouTube, checked with YouTube oEmbed. ESPN's own upload
// (ESPN College Football, ESPN FC) is used where one exists; otherwise the official league, team or
// conference channel (NFL, MLB, MLS, PGA Tour, Big Ten, Big 12). Full replays point at the same highlight.
// Videos without a youtubeId play in the demo player. Astros-Athletics (9/27) has no video on purpose,
// so the "No video yet" state still shows.
const v = (id, title, teams, sport, type, duration, published, youtubeId) =>
  ({ id, title, teams, sport, type, duration, published, ...(youtubeId ? { youtubeId } : {}) });

export const VIDEOS = [
  // Demo feed: NFL Sunday, week 3 (9/27)
  v('v31', '49ers beat the Cardinals 36-30 to move to 3-0', ['San Francisco 49ers', 'Arizona Cardinals'], 'NFL', 'highlight', 16, '2026-09-27', '7ngu-tT0PQs'),
  v('v32', '49ers vs. Cardinals: Full Game Replay', ['San Francisco 49ers', 'Arizona Cardinals'], 'NFL', 'full replay', 188, '2026-09-27', '7ngu-tT0PQs'),
  v('v33', 'Ravens take down Cowboys in an instant classic in Rio', ['Baltimore Ravens', 'Dallas Cowboys'], 'NFL', 'highlight', 21, '2026-09-27', '7gWPdESD1og'),
  v('v34', 'Ravens vs. Cowboys: Full Game Replay', ['Baltimore Ravens', 'Dallas Cowboys'], 'NFL', 'full replay', 194, '2026-09-27', '7gWPdESD1og'),
  v('v35', 'Raiders move to 3-0 with a road win over the Saints', ['Las Vegas Raiders', 'New Orleans Saints'], 'NFL', 'highlight', 27, '2026-09-27', 'NhlKfez7gIg'),
  v('v36', 'Raiders vs. Saints: Full Game Replay', ['Las Vegas Raiders', 'New Orleans Saints'], 'NFL', 'full replay', 186, '2026-09-27', 'NhlKfez7gIg'),
  v('v37', 'Broncos erase a 16-point deficit to beat the Rams', ['Denver Broncos', 'Los Angeles Rams'], 'NFL', 'highlight', 41, '2026-09-27', 'JUo_sMKXAqw'),
  v('v38', 'Rams vs. Broncos: Full Game Replay', ['Denver Broncos', 'Los Angeles Rams'], 'NFL', 'full replay', 191, '2026-09-27', 'JUo_sMKXAqw'),
  v('v39', 'Bills beat the Chargers despite five turnovers', ['Buffalo Bills', 'Los Angeles Chargers'], 'NFL', 'highlight', 16, '2026-09-27', 'v__pg6qIYL4'),
  v('v40', 'Chiefs handle the Dolphins 24-10', ['Kansas City Chiefs', 'Miami Dolphins'], 'NFL', 'highlight', 8, '2026-09-27'),
  v('v41', 'Giants hold off the Titans 12-7', ['New York Giants', 'Tennessee Titans'], 'NFL', 'highlight', 7, '2026-09-27'),

  // Demo feed: MLB final weekend
  v('v42', 'Dodgers finish the sweep of the Giants, 5-1', ['Los Angeles Dodgers', 'San Francisco Giants'], 'MLB', 'highlight', 12, '2026-09-27', '1lUaDvOzJno'),
  v('v43', 'Dodgers vs. Giants (9/27): Full Game Replay', ['Los Angeles Dodgers', 'San Francisco Giants'], 'MLB', 'full replay', 158, '2026-09-27', '1lUaDvOzJno'),
  v('v44', 'Rangers fall in the finale and miss the playoffs', ['Minnesota Twins', 'Texas Rangers'], 'MLB', 'highlight', 12, '2026-09-27', 'N6jSf3Z_oLY'),
  v('v45', 'Mariners beat the Angels 7-3 on the final day', ['Seattle Mariners', 'Los Angeles Angels'], 'MLB', 'highlight', 5, '2026-09-27'),

  // Demo feed: college football (9/25-26)
  v('v03', 'Clemson Tigers vs. California Golden Bears | Full Game Highlights', ['Clemson Tigers', 'California Golden Bears'], 'CFB', 'highlight', 26, '2026-09-25', 'w1ibgeMNIBQ'),
  v('v04', 'Clemson vs. Cal: Full Game Replay', ['Clemson Tigers', 'California Golden Bears'], 'CFB', 'full replay', 208, '2026-09-26', 'w1ibgeMNIBQ'),
  v('v05', "Oregon's backup QB torches USC for 41", ['Oregon Ducks', 'USC Trojans'], 'CFB', 'highlight', 4, '2026-09-26', 'LNfU-CRAw9s'),
  v('v06', 'Oregon vs. USC: Full Game Replay', ['Oregon Ducks', 'USC Trojans'], 'CFB', 'full replay', 214, '2026-09-27', 'LNfU-CRAw9s'),
  v('v07', 'Wisconsin rallies late to stun No. 13 Penn State', ['Wisconsin Badgers', 'Penn State Nittany Lions'], 'CFB', 'highlight', 4, '2026-09-26', 'h4JSDdsEq9M'),
  v('v08', 'Wisconsin vs. Penn State: Full Game Replay', ['Wisconsin Badgers', 'Penn State Nittany Lions'], 'CFB', 'full replay', 205, '2026-09-27', 'h4JSDdsEq9M'),
  v('v09', 'Texas Longhorns vs. Tennessee Volunteers | Full Game Highlights', ['Texas Longhorns', 'Tennessee Volunteers'], 'CFB', 'highlight', 32, '2026-09-26', 'ImD64r8tofM'),
  v('v10', 'Texas vs. Tennessee: Full Game Replay', ['Texas Longhorns', 'Tennessee Volunteers'], 'CFB', 'full replay', 201, '2026-09-27', 'ImD64r8tofM'),
  v('v46', 'Jeremiah Smith catches four TDs as Ohio State beats Illinois', ['Ohio State Buckeyes', 'Illinois Fighting Illini'], 'CFB', 'highlight', 4, '2026-09-26', 'FDTW_wi3G8Y'),
  v('v26', 'Oklahoma Sooners vs. Georgia Bulldogs | Full Game Highlights', ['Georgia Bulldogs', 'Oklahoma Sooners'], 'CFB', 'highlight', 17, '2026-09-26', 'pAlvX2_W7KU'),
  v('v27', 'Notre Dame routs Purdue 49-10', ['Notre Dame Fighting Irish', 'Purdue Boilermakers'], 'CFB', 'highlight', 4, '2026-09-26', 'wWbarnIToso'),
  v('v28', 'Central Michigan Chippewas vs. Miami Hurricanes | Full Game Highlights', ['Miami Hurricanes', 'Central Michigan Chippewas'], 'CFB', 'highlight', 3, '2026-09-26', 'Jq9Y-uA2ZUo'),
  v('v29', 'Texas Tech LB returns two picks for TDs vs. Sam Houston', ['Texas Tech Red Raiders', 'Sam Houston Bearkats'], 'CFB', 'highlight', 6, '2026-09-26', '7yBZ8bD_9FM'),
  v('v30', 'Houston Cougars vs. Georgia Southern Eagles | Full Game Highlights', ['Houston Cougars', 'Georgia Southern Eagles'], 'CFB', 'highlight', 15, '2026-09-26', 'qQ1Hn4GqSsk'),

  // Demo feed: golf and soccer
  v('v47', 'Presidents Cup Day 4 singles: the U.S. comes back to win', ['United States', 'International'], 'GOLF', 'highlight', 15, '2026-09-27', 'mnUnYWEiWFw'),
  v('v48', 'Late winner: Columbus Crew beat Messi and Inter Miami', ['Columbus Crew', 'Inter Miami CF'], 'SOCCER', 'highlight', 4, '2026-09-27', 'sRDuV81FijU'),
  v('v49', 'Preston Judd brace as San Jose beat Portland', ['San Jose Earthquakes', 'Portland Timbers'], 'SOCCER', 'highlight', 11, '2026-09-26', 'XHEVJA0HF84'),

  // Earlier in the week (not in the demo feed)
  v('v01', 'Dodgers edge Giants 4-3 to win the series', ['Los Angeles Dodgers', 'San Francisco Giants'], 'MLB', 'highlight', 6, '2026-09-26'),
  v('v02', 'Dodgers vs. Giants (9/26): Full Game Replay', ['Los Angeles Dodgers', 'San Francisco Giants'], 'MLB', 'full replay', 162, '2026-09-26'),
  v('v11', 'Dodgers blank Giants 2-0 behind two early homers', ['Los Angeles Dodgers', 'San Francisco Giants'], 'MLB', 'highlight', 5, '2026-09-25'),
  v('v12', 'Athletics hold off Astros 6-5', ['Athletics', 'Houston Astros'], 'MLB', 'highlight', 5, '2026-09-25'),
  v('v13', 'Rays rout Phillies 12-1', ['Tampa Bay Rays', 'Philadelphia Phillies'], 'MLB', 'highlight', 5, '2026-09-26'),
  v('v14', 'Mets cruise past Nationals 7-1', ['New York Mets', 'Washington Nationals'], 'MLB', 'highlight', 4, '2026-09-26'),
  v('v15', 'Yankees split doubleheader with Orioles', ['New York Yankees', 'Baltimore Orioles'], 'MLB', 'highlight', 6, '2026-09-25'),
  v('v16', 'Red Sox sweep doubleheader from Cubs', ['Boston Red Sox', 'Chicago Cubs'], 'MLB', 'highlight', 5, '2026-09-25'),
  v('v17', 'Mariners beat Angels 8-4', ['Seattle Mariners', 'Los Angeles Angels'], 'MLB', 'highlight', 4, '2026-09-26'),
  v('v18', 'Rams roll past Giants 28-6 on Monday Night Football', ['Los Angeles Rams', 'New York Giants'], 'NFL', 'highlight', 8, '2026-09-22'),
  v('v19', 'Rams vs. Giants: Full Game Replay', ['Los Angeles Rams', 'New York Giants'], 'NFL', 'full replay', 186, '2026-09-22'),
  v('v20', 'Falcons stun Packers 35-14 on Thursday Night Football', ['Atlanta Falcons', 'Green Bay Packers'], 'NFL', 'highlight', 9, '2026-09-25'),
  v('v21', 'Falcons vs. Packers: Full Game Replay', ['Atlanta Falcons', 'Green Bay Packers'], 'NFL', 'full replay', 181, '2026-09-25'),
  v('v22', 'Raiders handle Chargers 26-14', ['Las Vegas Raiders', 'Los Angeles Chargers'], 'NFL', 'highlight', 8, '2026-09-21'),
  v('v23', '49ers beat Dolphins 35-13', ['San Francisco 49ers', 'Miami Dolphins'], 'NFL', 'highlight', 8, '2026-09-21'),
  v('v24', 'Chiefs outlast Colts 33-30 in overtime', ['Kansas City Chiefs', 'Indianapolis Colts'], 'NFL', 'highlight', 10, '2026-09-21'),
  v('v25', 'No. 4 Indiana holds off Northwestern 29-23', ['Indiana Hoosiers', 'Northwestern Wildcats'], 'CFB', 'highlight', 7, '2026-09-25'),
];
