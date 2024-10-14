

// ############################### DIRECTORIES #######################################
const directories = {
    Formation: [
        '',
        '<white>Formation</white>',

        ''
    ],
    Projets: [
        '',
        '<white>Projets</white>',
        [
            'Terminal-Portfolio'
        ].map((name, url, description = '') => {
            return `<a href="${url}>"${name}</a> &mdash; <white>${description}</white>`;
        }),
        ''
    ].flat(),
    Competences: [
        '',
        '<white>Competences</white>',
        [
            'Javascript',
            'Python',
            'PHP',
            'SQL',
            'Bash',
            'Rust',
            'Java',
            'Go',
            'C#'
        ].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>Librairies</white>',
        [
            'net/http',
            'Bootstrap'
        ].map(lib => `* <green>${lib}</green>`),
        '',
        '<white>Outils</white>',
        [
            'Docker',
            'Git',
            'GNU/Linux'
        ].map(lib => `* <blue>${lib}</blue>`),
        ''
    ].flat()
};



// ############################### COMMANDS #######################################
const root = '~';
let cwd = root;

const commands = {
    // ________________ command _________________________________
    Hello() {
        term.echo(`Bonjour, je suis Maxence VILLET SCHOUMAKER.
Je suis une personne qui aime le challenge avec une affinité avec le team working.
Je cherche actuellement un stage en tant que Développeur Full-Stack du 26 mai au 8 août 2025.
Pour en savoir plus sur moi, n'hésitez pas à écrire 'help' et à appuyer sur entrée.`);
    },
    
    // ________________ cd _________________________________
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
          } else if (dir.startsWith('~/')) {
            const relativeDir = dir.substring(2);
            if (directories.hasOwnProperty(relativeDir)) {
              cwd = root + '/' + relativeDir;
            } else {
              this.error('Wrong directory');
            }
          } else if (directories.hasOwnProperty(dir)) {
            cwd = root + '/' + dir;
          } else {
            this.error('Wrong directory');
          }
    },
    // ________________ help _________________________________
    help() {
        term.echo(`Liste des commandes disponible: ${help}`);
    },
    // ________________ echo _________________________________
    echo(...args) {
        if(args.length > 0) {
            term.echo(args.join(' '));
        }
    },
    // ________________ ls _________________________________

    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                // ls ~ or ls ~/
                print_dirs();
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_dirs();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
            print_dirs(directories);
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    },
    // ________________ Joke _________________________________

    async joke() {
        const res = await fetch(url);
        const data = await res.json();
        (async () => {
            if (data.type == 'twopart') {
                const prompt = this.get_prompt();
                this.set_prompt('');
                await this.echo(`Q: ${data.setup}`, {
                    delay: 50,
                    typing: true
                });
                await this.echo(`R: ${data.delivery}`, {
                    delay: 50,
                    typing: true
                });

                this.set_prompt(prompt);
            } else if (data.type === 'single') {
                await this.echo(data.joke, {
                    delay: 50, 
                    typing: true
                });
            }
        })();
    },

    credits() {
        return [
            '',
            '<white>Used libraries:</white>',
            '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
            '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
            '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
            '* <a href="https://jokeapi.dev/">Joke API</a>',
            ''
        ].join('\n');
    }
};

// ############################### LS #######################################
function print_dirs() {
    for (const dir in directories) {
      if (Array.isArray(directories[dir])) {
        term.echo(directories[dir].map(item => `<blue class="directory">${item}</blue>`).join('\n'));
      }
    }
  }

// ############################### PROMPTS #######################################
const user = 'invité';
const server = 'localhost';

function prompt() {
    return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

$.terminal.xml_formatter.tags.green = (attrs) => {
    return `[[;#44D544;]`;
};

$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#55F;;${attrs.class}]`;
}

// ############################### TERMINAL #######################################


const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    completion(string) {
        // in every function we can use `this` to reference term object
        const cmd = this.get_command();
        // we process the command to extract the command name
        // and the rest of the command (the arguments as one string)
        const { name, rest } = $.terminal.parse_command(cmd);
        if (['cd', 'ls'].includes(name)) {
        if (rest.startsWith('~/')) {
            return directories.map(dir => `~/${dir}`);
        }
        if (cwd === root) {
            return Object.keys(directories);
        }
        }
        return Object.keys(commands);
    },
    prompt
});

term.exec('Hello', {
    delay: 200,
    typing: true
});


term.pause();

term.on('click', '.command', function() {
    const command = $(this).text();
    term.exec(command);
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`);
});


// ###################### JOKES ############################################
 
const url = 'https://v2.jokeapi.dev/joke/Programming';




const greetings = 'Portfolio';

const font = 'Big';
figlet.defaults({fontPath: 'https://unpkg.com/figlet/fonts/'});
figlet.preloadFonts([font], ready);



function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function ready() {
    const seed = rand(256);
    term.echo(() => rainbow(render(greetings), seed))
        .echo(`<white>Maxence VILLET SCHOUMAKER</white>\n`).resume();
}

function render(text) {
    const cols = term.cols();
    return trim(figlet.textSync(text, {
        font: font,
        width: cols - 10,
        whitesoaceBreake: true
    }));
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function rainbow(string, seed) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;#0f0;]${char}]`;
    }, string, seed).join('\n');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}

const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

const commanns = {
    
}

const command_list = Object.keys(commands);
const formatted_list = command_list.map(cmd =>{
    return `<white class="command">${cmd}</white>`;
});
const help = formatter.format(formatted_list);



const re = new RegExp(`^\s*(${command_list.join('|')}) (.*)`);

$.terminal.new_formatter(function(string) {
    return string.replace(re, function(_, command, args) {
        return `<white>${command}</white> <aqua>${args}</aqua>`;
    });
});