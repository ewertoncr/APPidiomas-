const CONTENT = {
  en: {
    lessons: [
      { id:1, title:'Greetings & Hello', desc:'Cumprimentos básicos', xp:20, cat:'foundation', unit:'1 · Foundations',
        vocab:[
          {w:'Hello / Hi', m:'Olá / Oi', e:'Hi! How are you?'},
          {w:'Nice to meet you', m:'Prazer em conhecê-lo', e:'Nice to meet you. I\'m Ana.'},
          {w:'Good morning', m:'Bom dia', e:'Good morning! How are you today?'}
        ],
        sections:[
          {t:'intro', c:'Vamos começar do zero: cumprimentos essenciais.'},
          {t:'vocab'},
          {t:'mc', q:'Qual é a forma mais natural de cumprimentar um colega?', opts:['Good morning, how do you do?','Hey, good morning!','I greet you'], ok:1, fb:"'Hey, good morning!' é natural."},
          {t:'speak', p:'Cumprimente alguém e diga seu nome.', e:"Hi! Nice to meet you. I'm Lucas."}
        ]},
      { id:2, title:'Talking About Yourself', desc:'Falar sobre você', xp:25, cat:'foundation', unit:'1 · Foundations',
        vocab:[
          {w:"I'm a...", m:'Eu sou...', e:"I'm a software developer."},
          {w:'I work as a...', m:'Trabalho como...', e:'I work as a project manager.'},
          {w:"I've been doing this for...", m:'Faço isso há...', e:"I've been doing this for three years."}
        ],
        sections:[
          {t:'intro', c:'Aprenda a se apresentar de forma clara.'},
          {t:'vocab'},
          {t:'mc', q:'Como dizer "trabalho como analista há 2 anos"?', opts:['I work like analyst for 2 years',"I've been working as an analyst for 2 years",'I am analyst since 2 years'], ok:1, fb:'Present Perfect Continuous é a forma natural.'},
          {t:'speak', p:'Apresente-se: nome, função e tempo na área.', e:"Hi, I'm Mariana. I work as a marketing specialist and I've been doing this for four years."}
        ]},
      { id:3, title:'Professional Introductions', desc:'Apresentações profissionais', xp:30, cat:'foundation', unit:'1 · Foundations',
        vocab:[
          {w:"I'm in charge of...", m:'Sou responsável por...', e:"I'm in charge of the marketing team."},
          {w:'I report to...', m:'Reporto para...', e:'I report to the Regional Manager.'}
        ],
        sections:[
          {t:'intro', c:'Apresentações profissionais em inglês.'},
          {t:'vocab'},
          {t:'mc', q:"Forma natural de 'sou responsável pelo time':", opts:["I am the responsible of the team","I'm in charge of the team","I make the team"], ok:1, fb:"'I'm in charge of...' é a mais usada."},
          {t:'speak', p:'Apresente-se com função e para quem reporta.', e:"Hi, I'm Alex. I'm a Project Coordinator and I'm in charge of client onboarding."}
        ]},
      { id:4, title:'Office Small Talk', desc:'Conversas casuais no escritório', xp:30, cat:'foundation', unit:'1 · Foundations',
        vocab:[
          {w:"How's your week going?", m:'Como está sua semana?', e:"Hey, how's your week going?"},
          {w:"I've been swamped", m:'Estou atolado', e:"I've been swamped with deadlines."}
        ],
        sections:[
          {t:'intro', c:'Small talk constrói relacionamento no trabalho.'},
          {t:'vocab'},
          {t:'mc', q:'Resposta natural quando está ocupado:', opts:['It is very busy for me',"I've been pretty swamped, to be honest",'My week is full'], ok:1, fb:"'I've been pretty swamped' é natural."},
          {t:'speak', p:"Responda 'How's your week going?'", e:"It's been busy, but good. I've been swamped. How about you?"}
        ]},
      { id:5, title:'Meeting Participation', desc:'Participar de reuniões', xp:35, cat:'meetings', unit:'2 · Meetings',
        vocab:[
          {w:'Can I jump in here?', m:'Posso entrar aqui?', e:'Can I jump in here for a second?'},
          {w:'From my perspective...', m:'Do meu ponto de vista...', e:'From my perspective, we should wait.'}
        ],
        sections:[
          {t:'intro', c:'Intervir com confiança em reuniões.'},
          {t:'vocab'},
          {t:'mc', q:'Forma natural de entrar na conversa:', opts:['I want to say something','Can I jump in here?','Excuse me I speak'], ok:1, fb:"'Can I jump in here?' é polido."},
          {t:'speak', p:"Use 'From my perspective...'", e:'From my perspective, we should consider the budget first.'}
        ]},
      { id:6, title:'Interview: Tell me about yourself', desc:'Pitch de entrevista', xp:40, cat:'interview', unit:'3 · Interviews',
        vocab:[
          {w:"I've been working in...", m:'Tenho trabalhado em...', e:"I've been working in marketing for four years."},
          {w:'What attracted me to this role is...', m:'O que me atraiu nesta vaga foi...', e:'What attracted me to this role is the international exposure.'}
        ],
        sections:[
          {t:'intro', c:'Estrutura: Presente → Passado → Por que esta vaga.'},
          {t:'vocab'},
          {t:'speak', p:"Responda 'Tell me about yourself'.", e:"I'm currently a Project Coordinator. In my previous role I improved response time by 30%. What attracted me to this role is the international exposure."}
        ]},
      { id:7, title:'Strengths & Weaknesses', desc:'Pontos fortes e fracos', xp:40, cat:'interview', unit:'3 · Interviews',
        vocab:[
          {w:'One of my strengths is...', m:'Um dos meus pontos fortes é...', e:'One of my strengths is problem-solving under pressure.'},
          {w:"I'm working on improving...", m:'Estou trabalhando para melhorar...', e:"I'm working on improving my public speaking."}
        ],
        sections:[
          {t:'intro', c:'Falar de pontos fortes e fracos de forma inteligente.'},
          {t:'vocab'},
          {t:'mc', q:'Melhor forma de falar de um ponto fraco:', opts:['I have no weaknesses','I am bad at speaking',"I'm working on improving my public speaking"], ok:2, fb:'Mostre autoconhecimento e ação.'},
          {t:'speak', p:'Fale de um ponto forte e um a melhorar.', e:"One of my strengths is staying organized under pressure. I'm working on improving my public speaking."}
        ]},
      { id:8, title:'STAR Method', desc:'Perguntas comportamentais STAR', xp:45, cat:'interview', unit:'3 · Interviews',
        vocab:[
          {w:'Situation / Task / Action / Result', m:'Situação / Tarefa / Ação / Resultado', e:'Let me walk you through a situation...'},
          {w:'The result was...', m:'O resultado foi...', e:'The result was a 20% increase in satisfaction.'}
        ],
        sections:[
          {t:'intro', c:'Método STAR: Situação, Tarefa, Ação, Resultado.'},
          {t:'vocab'},
          {t:'mc', q:'O que significa R no STAR?', opts:['Reason','Result','Risk'], ok:1, fb:'R = Result.'},
          {t:'speak', p:'Conte uma conquista usando STAR.', e:'We had a tight deadline (Situation). I coordinated the team (Task). I set daily check-ins (Action). We delivered on time (Result).'}
        ]}
    ],
    calls: [
      {id:'c1', title:'Call a colleague', name:'Sarah', role:'Product Manager', avatar:'👩‍💼', xp:25,
        turns:[{who:'them',text:'Hello, Sarah speaking.'},{who:'you',hint:'Apresente-se'},{who:'them',text:'How can I help?'},{who:'you',hint:'Explique o que precisa'},{who:'them',text:"I'll get back to you."},{who:'you',hint:'Agradeça'}]},
      {id:'c2', title:'Interview practice', name:'Emma', role:'Recruiter', avatar:'👩‍💼', xp:40,
        turns:[{who:'them',text:'Tell me a bit about yourself.'},{who:'you',hint:'Faça seu pitch'},{who:'them',text:'What is one of your strengths?'},{who:'you',hint:'Fale de um ponto forte'},{who:'them',text:'Do you have questions for me?'},{who:'you',hint:'Faça uma pergunta'}]}
    ]
  },
  fr: { lessons: [], calls: [] },
  es: { lessons: [], calls: [] },
  zh: { lessons: [], calls: [] },
  it: { lessons: [], calls: [] }
};
