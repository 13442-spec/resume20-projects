const CATEGORIES=[["全部场景","All"],["客户经营与服务","客户"],["营销与产品","营销"],["零售银行与财富管理","零售"],["对公与交易银行","对公"],["授信与信贷风控","信贷"],["金融市场与投资研究","投研"],["风险管理与合规","风控"],["运营、审计与数据","运营"],["管理、战略与办公","管理"]];
CATEGORIES.push(["通用办公与交付","办公"]);
const C=Object.fromEntries(CATEGORIES.slice(1).map(x=>[x[1],x[0]]));
const p=(id,category,name,description,tags,body)=>({id,category,name,description,tags,body,builtin:true});
const BUILTINS=[
p("customer-insights","客户","客户互动记录提炼","从客户经理与客户的对话中形成结构化客户档案、需求和后续动作。",["客户画像","会议纪要","CRM"],
"你是银行客户经营分析助手。请从下方客户经理与客户的互动记录中提取事实，生成可写入CRM的结构化摘要。\n\n"+
"处理规则：仅提取记录明确支持的信息，不推断收入、资产、风险偏好或购买意愿；区分客户表达、经理判断和待核实事项；对姓名、账号、证件号、联系方式做脱敏；矛盾信息并列标记待核实。\n\n"+
"输出：客户概况｜已确认信息｜客户当前需求｜未满足需求/痛点｜意向产品及证据｜异议与顾虑｜风险或适当性关注｜承诺事项（负责人/截止日期）｜建议下一步｜待核实问题。未提及写“未提及”。\n\n【互动记录】\n{{互动记录}}"),
p("meeting-actions","客户","客户会议纪要与行动项","把访谈或会议原始记录转成决策、行动项和跟进计划。",["会议纪要","行动项"],
"请把以下银行业务会议/客户访谈记录整理为可执行纪要。\n\n"+
"输出：一、会议基本信息（缺失项标未知）；二、客户目标与现状；三、讨论要点（区分事实、观点、假设）；四、达成结论与未决事项；五、行动项表格（行动、负责人、截止时间、依赖、完成标准）；六、跟进话术草稿。\n"+
"不得补写材料中没有的信息；模糊责任人或日期标注“需确认”；不得承诺未批准条件。\n\n【原始记录】\n{{会议记录}}"),
p("needs-discovery","客户","客户需求访谈问题设计","按客户类型生成开放式需求问题，帮助经理补齐需求信息。",["需求分析","访谈"],
"你是银行客户需求访谈教练。针对{{客户类型}}客户及{{业务主题}}，设计不诱导、不预设结论的访谈提纲。\n\n"+
"包括：开场与授权说明、现状、目标与时间、资金/现金流或服务痛点、决策流程、约束条件、风险承受与流动性需求（如涉及投资）、总结确认、经客户同意的下一步。每个问题标注必问/选问及用途。避免索取无业务必要的敏感信息；投资产品需提示按适当性流程核实。\n\n【已知背景】\n{{客户背景}}"),
p("complaint-analysis","客户","客户投诉归因与回复草稿","归纳投诉主题、根因和补救步骤，生成审慎的回复草稿。",["投诉处理","服务质量"],
"你是银行客户服务质量分析助手。处理以下投诉材料。\n\n"+
"输出：客户诉求摘要；可验证事实/客户主张/内部待查；情绪、影响范围、时效和升级信号；根因分类及证据（证据不足标待核查）；调查清单、责任岗位、客户更新节点、补救选项及审批要求；客户回复草稿。\n"+
"回复应同理、清晰，不承认未经核实事实，不作未经批准的赔偿或业务承诺。\n\n【投诉材料】\n{{投诉材料}}"),
p("customer-segmentation","客户","客户分层与经营策略","基于脱敏客户数据提出透明、可解释的分层和服务动作。",["客户分群","数据分析"],
"请分析以下脱敏客户数据并形成可解释的客户分层建议。仅使用给定字段；先检查缺失、异常和样本偏差；不基于敏感个人属性推断；不得把相关性解释为因果。\n\n"+
"输出：分层规则、样本数/占比（可计算时）、主要需求特征、适合和应避免的服务动作、经营假设、试点设计、监控指标和限制。授信或定价不得输出自动决策结论。\n\n【数据】\n{{客户数据}}"),
p("followup-message","客户","客户跟进消息起草","按已确认的下一步编写短信、邮件或企业微信内容。",["客户沟通","话术"],
"请为{{沟通渠道}}起草发给{{客户称谓}}的客户跟进消息。\n背景：{{沟通背景}}\n已确认信息：{{已确认事项}}\n希望客户采取的下一步：{{下一步}}\n\n"+
"语气尊重、简洁、具体；只提已确认产品条件；不制造紧迫感、不保证收益、不暗示审批必然通过；涉及投资风险时保留必要提示。输出正式版和口语版各一条。"),
p("product-fit","零售","产品适配说明与差异比较","根据客观特征对比产品，不替代适当性评估或销售审批。",["产品比较","适当性"],
"请根据提供的产品资料与客户需求制作中立比较。按期限、流动性、费用、风险等级、收益机制、退出条件、保障范围比较；区分资料事实、有限分析和待核实信息。未提供标注“未提供”，不得补造收益费率或监管保障。\n\n"+
"最后列出适当性评估前必须确认的问题和不适配情形。不得直接判断客户适合购买，不得承诺收益。\n\n【客户需求】\n{{客户需求}}\n【产品资料】\n{{产品资料}}"),
p("wealth-review","零售","财富管理组合定期回顾","从目标、期限、流动性和风险暴露角度审阅组合信息。",["财富管理","风险"],
"请基于脱敏组合信息形成中立的财富管理回顾。说明期间、数据口径和缺失项；概述资产配置、集中度和期间表现；识别流动性、期限错配、发行人/行业暴露和产品条款风险；对照客户目标但不替代适当性流程。\n\n"+
"输出：观察到的事实/需核实/可讨论的方向/风险提示/持牌人员需确认的问题。不得预测收益或给确定买卖指令。\n\n【客户目标】\n{{客户目标}}\n【组合数据】\n{{组合数据}}"),
p("sme-cashflow","对公","小微企业现金流访谈摘要","梳理企业现金流来源、季节性、回款、偿债和材料缺口。",["小微企业","现金流"],
"请将以下企业访谈及材料整理成小微企业现金流分析底稿。输出：经营模式与交易链、收入来源和客户集中度、应收应付周期、季节性与库存占用、经营性现金流事实、现有债务和偿债安排、压力情景、信息来源及可信度、矛盾点与补件清单、后续问题。\n\n"+
"区分企业陈述、文件证据和分析判断；未经核实的口头收入不得当作事实；不得仅凭本分析形成授信意见。\n\n【访谈】\n{{访谈摘要}}\n【材料】\n{{材料清单}}"),
p("credit-memo","信贷","授信调查报告结构化初稿","将调查材料按经营、财务、还款来源、风险缓释和待核查项整理。",["授信调查","尽调"],
"你是授信调查材料整理助手，不是审批人。基于材料起草摘要：申请事项与用途；借款人及关联方；股权治理；经营模式与行业；财务趋势和现金流；第一还款来源；担保/押品及第二还款来源；风险和缓释；贷后关注；待核实事项。\n\n"+
"每条结论标证据来源或分析判断；注明期间、币种、单位；识别口径不一致；不得虚构财务比率、担保价值或审批结论，不得弱化重大不利信息。\n\n【申请要素】\n{{申请要素}}\n【调查资料】\n{{调查资料}}"),
p("financial-spread","信贷","企业财务数据趋势分析","比较多期财务指标、发现异常并解释限制。",["财务分析","授信"],
"请对企业多期财务数据做描述性分析。先核对期间、币种、单位、合并范围和会计口径；计算可得的同比、毛利率、资产负债率、流动比率、应收周转并展示公式；指出趋势、异常和可能解释；区分数据支持与待验证假设；列出需要补充的材料。\n\n"+
"不得把指标当自动授信规则，不得仅凭比率判定欺诈或违约。\n\n【数据】\n{{财务数据}}"),
p("repayment-source","信贷","还款来源与压力情景分析","辨析第一还款来源，构造简单压力情景并列明假设。",["偿债能力","压力测试"],
"分析借款人还款来源和敏感因素。分别列出经营现金流等第一还款来源、担保处置等第二还款来源；核对还款时间与债务期限；识别收入、成本、利率、回款周期、汇率等变量；数据允许时构建基准、温和压力、严重压力情景并展示计算。\n\n"+
"标明假设和数据缺口；担保不等于正常还款来源；测试不是违约预测或审批结论。\n\n【偿债资料】\n{{偿债资料}}"),
p("early-warning","信贷","贷后风险信号归纳与分级","从贷后信息识别风险信号、证据和待核实动作。",["贷后管理","预警"],
"依据贷后材料建立风险信号台账。字段：信号、首次出现时间、来源、可信度、涉及主体、可能影响、矛盾信息、紧急程度及理由、核实动作、责任岗位、建议时限。\n\n"+
"按材料判断，不将传闻写成事实；诉讼、逾期、停产、控制权变化等区分已核实与待核实。不得自行决定冻结、抽贷或报送监管。\n\n【材料】\n{{贷后材料}}"),
p("collateral-review","信贷","押品资料核对清单","检查权属、登记、估值时点和处置限制。",["押品","抵质押"],
"检查抵押/质押资料完整性。按押品类型核对：权属证明、权利限制、登记/交付、估值机构与时点、方法、优先权、保险、保管、处置条件、价值波动。标出缺失、过期、名称不一致、权属链断点和需外部确认事项。\n\n"+
"不得自行认定担保有效、估造价值或把估值等同可回收金额。按必须补齐/建议补充/持续监控分组。\n\n【押品资料】\n{{押品资料}}"),
p("trade-finance","对公","贸易融资单据差异核对","按单据清单标记字段不一致与人工复核点。",["贸易融资","单据审核"],
"对比申请、合同、发票、运输单据、保险单、报关等材料中的交易双方、商品、数量、金额、币种、日期、装运条件、地点和签章。表格输出字段、文件A、文件B、差异、重要性、待核实动作。\n\n"+
"只检查给出的文本，不验证真伪，不据此作放款决定；缺失字段写无法核对，不自行补齐。\n\n【单据摘录】\n{{单据摘录}}"),
p("market-brief","投研","宏观与市场晨会简报","把给定数据和新闻整理为市场简报，分清事实和观点。",["宏观","市场"],
"根据材料撰写{{日期}}市场晨会简报：一句话摘要；宏观数据与政策事实；利率、汇率、股票、信用和商品变化（仅限已给数据）；驱动因素及证据；市场分歧；未来关注日历；风险情景。\n\n"+
"事实标来源和时间，解释标市场观点/分析假设；无来源标待核实。不生成买卖指令、不预测确定点位，不把相关性写成因果。\n\n【材料】\n{{市场材料}}"),
p("company-research","投研","上市公司研究框架与反证","构建公司研究提纲，主动寻找反方证据和关键假设。",["公司研究","基本面"],
"基于公开资料形成研究框架，不构成投资建议。包括业务和收入来源、产业链与竞争、历史经营和现金流、资产负债与资本开支、治理与关联交易、估值驱动变量、核心逻辑、可能推翻逻辑的反证及待核实风险。\n\n"+
"区分披露事实、计算、分析判断，注明信息日期和来源；不得补造预测或目标价。资料不足时先列问题，不强行下结论。\n\n【研究范围】\n{{研究范围}}\n【资料】\n{{公开资料}}"),
p("portfolio-risk","投研","投资组合风险暴露汇总","分析集中度、因子暴露和情景敏感性，不输出买卖指令。",["组合风险","资产配置"],
"对脱敏组合持仓分析资产类别、行业、发行人、币种、期限、流动性和风险因子集中度；数据可用时计算权重、前五大占比和情景变化；区分市值变化与实际损益；识别估值、流动性、相关性和时点限制。\n\n"+
"输出事实表、风险观察、补充数据和投资委员会讨论问题。不得预测收益、替代适当性判断或给个性化买卖指令。\n\n【持仓】\n{{持仓数据}}"),
p("bond-review","投研","债券信用分析要点","梳理偿债能力、债务结构、支持因素和关键风险。",["债券","信用研究"],
"基于资料整理债券发行人分析：业务与行业、盈利质量和现金流、资本结构和到期分布、流动性与再融资、担保/支持和交叉违约、治理和关联方、公开负面信息、下行风险与缓释因素。\n\n"+
"事实附来源和日期，口径不明时标注；区分主体信用与债项增信；不输出未经授权评级或交易建议。\n\n【资料】\n{{债券资料}}"),
p("aml-alert-review","风控","反洗钱预警材料摘要","结构化预警事实、关联关系和调查缺口，避免将预警等同违法认定。",["反洗钱","预警"],
"依据脱敏材料整理反洗钱预警摘要。输出触发规则、交易时间/金额/频率/渠道/对手方、客户业务背景、异常及与画像差异、合理解释与支持/反对证据、信息缺口、后续核实和升级条件。\n\n"+
"保持中性和可追溯，不将预警表述为违法事实，不建议规避监测，不扩散不必要个人数据。判断注明依据和不确定性。\n\n【材料】\n{{预警材料}}"),
p("policy-gap","风控","制度要求与流程差距检查","对照内部制度摘录识别流程缺口和需确认事项。",["合规检查","制度"],
"将业务流程与给定制度逐条对照。表格字段：制度原文/条款号、对应步骤、现有证据、差距、风险影响、建议控制、责任岗位、需确认问题。\n\n"+
"仅以给定制度为依据，不将模型理解当法律意见；指出版本和适用范围不明处；涉及法律解释、监管口径或重大合规判断需法务/合规确认。\n\n【制度】\n{{制度摘录}}\n【流程】\n{{业务流程}}"),
p("regulatory-change","风控","监管政策变化影响评估","拆解政策要求、业务影响、责任与实施节点。",["监管政策","政策解读"],
"分析以下政策对{{业务条线}}的潜在影响。提取发布机构、文件名、文号、生效日、适用对象和原文依据；按新增/变化/删除列条款；映射产品、流程、系统、合同、数据、培训、报送和第三方；列责任角色、依赖、待确认和时间表。\n\n"+
"只引用提供文本，区分原文要求与分析建议；不杜撰监管口径；现行有效性需以官方来源核验。\n\n【政策文本】\n{{政策文本}}"),
p("incident-report","运营","运营事件报告与根因分析","整理事件时间线、影响范围、根因假设和整改验证。",["运营事件","根因分析"],
"基于材料生成运营事件复盘：摘要、时间线、影响范围与客户影响、已知事实和来源、临时处置、直接原因/促成因素/控制失效、未确认假设、整改措施（负责人/时限/完成证据）、复发指标和经验教训。\n\n"+
"不以“员工失误”作为未经分析的最终根因，不隐去不利事实，客户/金额/账户信息须脱敏。\n\n【材料】\n{{事件材料}}"),
p("process-sop","运营","银行业务流程SOP起草","把流程转成角色、步骤、校验点、异常和升级路径。",["SOP","流程优化"],
"将流程材料整理为操作规程草案：目的与范围、术语、角色权限、前置条件、编号步骤（输入/动作/系统记录/校验/输出）、异常与升级、时限服务标准、留痕、待确认事项。\n\n"+
"不要创造未提供的审批权限、系统操作或监管时限。流程冲突时指出并要求负责人确认。\n\n【材料】\n{{流程材料}}"),
p("reconciliation","运营","对账差异分类与排查","按金额、日期、状态和来源对账并建议排查顺序。",["对账","运营分析"],
"分析对账数据，先确认期间、币种、时区和唯一键；按未达、重复、金额不一致、日期错位、状态差异、手续费/汇率差异分类；列出匹配、待匹配、疑似重复记录与金额；给出需调取的凭证或日志。\n\n"+
"不得自动冲销或改账；金额调整需授权人员复核。\n\n【账单A】\n{{账单A}}\n【账单B】\n{{账单B}}"),
p("kpi-dashboard","运营","经营指标周报解读","解释指标变化、驱动因素和数据限制，生成周会要点。",["经营分析","KPI"],
"根据指标制作周报解读：实际值、目标、环比/同比；超标和未达项；最大变化；数据口径和缺失；可验证驱动；需业务核实的假设；下周行动和负责人建议。\n\n"+
"不把单周变化直接归因于活动，不隐去不利指标，不把建议写成已批准决策。\n\n【数据】\n{{指标数据}}"),
p("campaign-review","营销","营销活动复盘与增量评估","区分触达、转化和增量效果，提醒对照组与归因限制。",["营销分析","活动复盘"],
"复盘活动目标、客群、渠道、预算、期间和口径；计算触达、响应、转化、成本等可得指标；检查去重、归因窗口、自然转化和对照组；区分描述性结果与因果结论；指出投诉、退订、误售和合规风险；建议下一轮实验与指标。\n\n"+
"没有对照设计时，不宣称活动带来增量效果。\n\n【活动数据】\n{{活动数据}}"),
p("product-launch","营销","金融产品上市沟通包","从已批准资料生成不同渠道的产品介绍与风险提示。",["产品营销","文案"],
"基于已批准产品资料生成客户经理30秒介绍、官网短文、常见问题5条、费用与风险摘要。保留产品名称、对象、期限、费用、风险等级、限制条件原文；不得承诺收益、弱化风险、创造优势或使用无依据的保本/稳赚表述。\n\n"+
"未提供或需审批的内容标待确认；最终发布前需产品、法务合规和品牌审核。\n\n【产品资料】\n{{产品资料}}"),
p("board-brief","管理","管理层决策简报","压缩材料为决策选项、影响、风险和待拍板事项。",["管理简报","决策"],
"把材料整理成管理层决策简报，控制在{{篇幅}}。结构：决策事项；建议（证据足够时）及理由；备选方案；财务/客户/运营/合规影响；主要风险与缓释；关键假设；需拍板问题；下一步和责任人。\n\n"+
"区分事实、预测、假设和建议；保留重大不利信息；证据不足时列选项，不强行给唯一结论。\n\n【材料】\n{{决策材料}}"),
p("email-draft","管理","银行内部邮件与汇报润色","提高内部沟通清晰度，同时保留事实和责任边界。",["邮件","写作"],
"润色以下银行内部邮件/汇报。读者：{{读者}}；希望采取的动作：{{期望动作}}。\n\n"+
"标题具体；开头交代目的；事实、判断、请求分开；责任人和截止时间清楚；语气专业克制；保留原有数字、条件和责任边界；不新增未经确认承诺。输出修订稿和需作者确认的事实/歧义。\n\n【原文】\n{{原文}}"),
p("kyc-gap","客户","开户/KYC材料缺口检查","按给定清单核对开户尽调材料，列出缺件和复核事项。",["开户","KYC","材料核验"],
"请根据给定的机构客户类型、业务范围和本机构材料清单，检查开户/KYC材料的完整性。输出：已提供材料、缺失材料、名称/日期/主体不一致、受益所有人或授权链待核实点、文件有效性待确认点、下一步联系客户的问题和内部复核岗位。\n\n"+
"只按提供的制度清单和文件摘录判断，不自行补充法定要求、不验证文件真伪、不以缺件检查代替风险审批。敏感证件和账号信息必须脱敏。\n\n【客户类型】\n{{客户类型}}\n【材料清单】\n{{制度清单}}\n【已收材料】\n{{已收材料}}"),
p("repayment-outreach","信贷","逾期还款客户沟通草稿","起草尊重、合规且不越权的还款提醒和后续记录。",["贷后沟通","逾期管理"],
"请基于已核实的账户状态与机构批准话术要求，起草一份{{沟通渠道}}还款提醒，并列出内部跟进记录要素。\n\n"+
"内容应说明核实过的欠款金额、对应期间、查询/异议渠道和可咨询方式；不威胁、不羞辱、不向无关第三方披露债务信息，不虚构法律后果，不承诺减免或重组。若金额或状态未核实，先生成内部核对清单而不是外呼话术。\n\n【核实信息】\n{{账户状态}}\n【批准话术/要求】\n{{沟通规范}}"),
p("treasury-forecast","对公","企业资金头寸与现金流预测","用回款、付款和融资计划形成短期头寸预测和资金缺口提示。",["资金管理","头寸预测","现金流"],
"请根据以下企业收付款计划形成{{预测周期}}资金头寸预测。先统一币种、日期、时点余额和已承诺/未承诺状态；按日或周汇总期初余额、预计流入、预计流出、净流量、期末余额；识别最低余额、资金缺口、集中到期和高不确定项。\n\n"+
"对每笔流量标注来源和确定性，给出基准/延迟回款情景及关键假设，不自动建议具体投资或融资交易。输出需要财资人员确认的事项。\n\n【余额与计划】\n{{资金计划}}"),
p("fx-exposure","对公","企业外汇敞口归集","归集币种、金额、期限和自然对冲信息，列待核实项。",["外汇风险","套期保值"],
"请基于给定业务资料归集企业外汇敞口。按币种、收/付款方向、金额、预计日期、合同状态、确定性、自然对冲和关联业务输出明细与期限分桶；计算净敞口（数据允许时展示步骤）；标出汇率敏感项目和信息缺口。\n\n"+
"区分已签合同与预算预测，说明报价口径和估值时点；不得预测汇率，不给出未经授权的具体衍生品交易指令。列出企业需与财资/合规人员确认的问题。\n\n【业务资料】\n{{外汇业务资料}}"),
p("regulatory-reconciliation","风控","监管报送数据口径核对","对照报送规则检查字段映射、口径冲突和异常变化。",["监管报送","数据治理"],
"请对照所给报送模板/口径说明和业务数据，执行报送前一致性检查。输出字段映射、来源系统、计算规则、期间/单位、空值和异常值、跨表勾稽关系、与上期差异及待确认事项。\n\n"+
"不要补造监管阈值或口径；不能确认的规则标记为需报送责任人/合规确认。仅指出问题，不自动修改源数据或提交报表。\n\n【报送规则】\n{{报送规则}}\n【数据摘录】\n{{报送数据}}"),
p("financial-statement-reader","投研","财务报表快速阅读","从三张报表提取经营趋势、现金质量和需深查的信号。",["财报分析","报表阅读"],
"请快速阅读以下公司财务报表摘录，生成研究用摘要。先注明报告期间、币种、单位、审计意见（如材料给出）和口径限制；按利润表、资产负债表、现金流量表提取关键变化；比较净利润与经营现金流；识别应收、存货、资本开支、债务和非经常性项目的异常线索。\n\n"+
"每个分析点标出数据依据和可能的替代解释；不把异常直接称作舞弊，不自行预测，不输出投资建议。最后列出需要查阅的附注和问题。\n\n【报表摘录】\n{{财报资料}}"),
p("journey-review","营销","银行客户旅程痛点诊断","按客户旅程映射等待、重复提交、信息断点和服务机会。",["客户旅程","服务设计"],
"请根据客户反馈、流程步骤和服务数据，诊断{{业务场景}}的客户旅程。按认知、咨询、申请、审核、使用、售后/退出阶段整理客户目标、触点、等待时间、重复提交、信息断点、情绪/投诉、责任部门和数据证据。\n\n"+
"区分客户明确反馈和分析推断，识别高影响低成本的流程改进机会，提出试点指标（完成率、耗时、补件率、投诉率等）及验证方式。不得牺牲必要风控或合规控制来单纯缩短流程。\n\n【流程与反馈】\n{{客户旅程材料}}"),
p("custom-analysis","运营","通用金融材料分析","提炼金融业务材料，整理证据、影响、风险和后续问题。",["材料提炼","通用"],
"请作为{{业务领域}}分析助手处理材料。任务目标：{{分析目标}}。\n\n"+
"依次完成：1. 不超过{{摘要长度}}概括；2. 提取关键事实并标原文依据；3. 区分事实、观点、假设、缺失信息；4. 归纳客户、业务、财务、风险或运营影响；5. 列出矛盾和核验事项；6. 给出下一步问题和行动建议。\n"+
"只依据材料；不得补造事实、法律结论、监管口径、收益预测或审批结果。输出使用{{输出格式}}。\n\n【材料】\n{{材料}}")
,
p("expense-ledger","运营","会计记账与账单生成","将脱敏收支流水整理为可核验的记账草稿和账单。",["会计记账","账单","财务"],
"请根据脱敏的收支流水生成记账草稿和账单。先确认期间、币种、含税/不含税口径、账户范围和借贷方向；逐笔提取日期、摘要、对方、金额、税额、科目建议、凭证依据和待确认项；按科目汇总收入、成本、费用、应收应付，并输出账单明细、汇总表和异常清单。\n\n不得凭商户名称臆断会计科目或税率；无法确认的标记‘需会计复核’，不自动记账、不申报税务。\n\n【流水】\n{{收支流水}}\n【科目表/规则】\n{{科目规则}}"),
p("receipt-ocr-check","运营","发票与报销单据核验","检查报销单据字段、金额勾稽和缺失材料。",["发票","报销","单据审核"],
"请核对脱敏发票、收据、报销单和付款记录。输出：单据编号、日期、供应商、项目、金额、税额、币种、付款方式；票据间金额/日期/主体差异；重复报销疑点；缺失签批、合同或验收材料；按‘可入账/需补件/需人工核验’分组。\n\n仅检查提供的文字或图片识别结果，不验证发票真伪，不自行判断税务合规或批准报销。\n\n【单据】\n{{报销材料}}"),
p("meeting-transcript","管理","会议录音转写与要点提取","把会议转写稿整理为决策、争议、行动项和待确认内容。",["会议录音","会议纪要","行动项"],
"请处理以下会议录音转写稿。先区分发言人和时间戳（无法确认则标未知），再输出：会议目的；三行摘要；关键事实与数据；讨论观点与分歧；已达成决定及依据；未决问题；行动项表格（任务、负责人、截止时间、交付标准、依赖）；需要二次确认的听不清/口误/数字。\n\n不要把讨论意见写成决策，不补写未出现的责任人和期限；姓名、电话、账号等信息脱敏。\n\n【转写稿】\n{{会议转写}}"),
p("meeting-to-followup","管理","会议纪要到跟进邮件","把会议结论转成不同对象可执行的跟进邮件和任务清单。",["会议跟进","邮件","项目管理"],
"根据会议纪要生成：1）内部行动清单；2）给客户/合作方的确认邮件；3）给管理层的进展摘要。每项保留原会议依据，标注负责人、截止时间、依赖和需确认事项；语气专业克制，不新增承诺，不把建议写成已批准决定。\n\n【会议纪要】\n{{会议纪要}}"),
p("chart-design","运营","数据图表选择与绘图提示词","根据数据目标选择合适图形并生成可执行的绘图说明或代码框架。",["数据可视化","图表","绘图"],
"请根据数据字段、分析问题和读者选择合适图表。输出：问题定义；推荐图形及不推荐原因；x/y轴、单位、排序、颜色和标签规则；异常值与缺失值处理；数据透视粒度；一张静态图和一个交互图的实现方案；如指定 Python/Excel/JavaScript，则给出可运行的最小代码或操作步骤。\n\n不得用面积、3D或双轴制造误导；标注数据期间、来源和口径；无法支撑的因果关系改为描述性表达。\n\n【数据样例/字段】\n{{数据}}\n【分析目标】\n{{分析目标}}\n【工具】\n{{绘图工具}}"),
p("dashboard-spec","运营","经营看板指标与布局设计","把业务目标转成指标字典、看板布局和刷新规则。",["数据看板","指标体系","BI"],
"请为{{业务团队}}设计经营看板。输出指标字典（名称、定义、公式、粒度、单位、来源、刷新频率、负责人）；核心KPI与诊断指标；页面布局和筛选器；下钻路径；权限与脱敏；异常阈值和提醒；数据质量检查。\n\n指标必须可计算、可追溯；没有给出阈值时标待确认，不把相关指标当成因果证明。\n\n【业务目标】\n{{业务目标}}\n【现有字段】\n{{数据字段}}"),
p("document-compare","管理","合同/制度版本差异对比","逐条比较两个版本并输出变化影响与复核清单。",["版本对比","合同审阅","制度"],
"请逐条比较版本A和版本B。表格输出：章节/条款、原文A、原文B、变化类型（新增/删除/措辞/数字）、可能影响、需业务/法务确认的问题。单独列出金额、期限、责任、违约、数据、审批和生效日期变化。\n\n不得把模型解释当法律意见；保留原文，不遗漏否定词和例外条件。\n\n【版本A】\n{{文档A}}\n【版本B】\n{{文档B}}"),
p("research-summary","管理","长文档摘要与证据卡片","从报告或论文中提取结论、证据、限制和可引用摘要。",["长文档","研究摘要","证据"],
"请阅读以下报告/论文摘录，输出：一句话结论；关键发现（每条附章节/页码或原文依据）；数据与方法；限制和反例；可用于汇报的三条表述；不可直接得出的结论；后续需要查证的问题。\n\n严格区分作者结论和你的概括，不补造页码、样本量或因果关系。\n\n【文档摘录】\n{{文档内容}}"),
p("job-description","管理","岗位JD拆解与简历匹配","将招聘JD转成能力清单、关键词和可证明经历映射。",["求职","岗位分析","简历"],
"请拆解以下岗位JD：岗位目标、硬性门槛、核心职责、工具/技能、行业知识、软技能、潜在评价标准和关键词。若任务是招聘面试设计，只输出岗位能力要求供后续评分卡使用，不请求候选人的个人经历。若任务是个人求职且已提供个人经历，再逐条映射为‘已有证据/不足/可补充材料’，提出简历项目排序和面试准备问题。\n\n不得虚构经历、证书或业绩；岗位未说明的要求标推测。\n\n【岗位JD】\n{{岗位描述}}\n【个人求职时的经历（可选）】\n{{个人经历}}"),
p("project-plan","管理","项目计划与风险台账","从目标和约束生成里程碑、任务依赖和风险跟踪表。",["项目管理","计划","风险台账"],
"请把项目目标和约束转成执行计划。输出里程碑、任务、负责人、开始/截止时间、依赖、完成标准、验收证据、风险概率/影响、触发信号、应对措施和决策记录模板。\n\n不得自行承诺资源或日期；缺失信息列澄清问题，关键路径和假设单独标记。\n\n【项目背景】\n{{项目背景}}"),
p("data-cleaning-spec","运营","数据清洗规则与质量报告","将原始表格转成可执行清洗规则和数据质量报告。",["数据清洗","数据质量","SQL"],
"请检查以下数据样例并生成清洗方案：字段类型和单位；缺失、重复、异常值、日期/币种/编码问题；跨表主键；保留/修正/剔除规则；SQL或Python伪代码；清洗前后质量指标；抽样复核和回滚方案。\n\n不得静默修改原始数据；每条规则说明依据和风险，无法判断时列人工确认项。\n\n【数据样例】\n{{数据样例}}\n【业务规则】\n{{业务规则}}")
];
BUILTINS.push(...(window.OFFICE_MODULES||[]).map(([id,name,description,body])=>p(id,"办公",name,description,["办公","组合模块"],body)));
const STORAGE="financePromptDesk.v1",MODEL_URL={chatgpt:"https://chatgpt.com/",claude:"https://claude.ai/new",gemini:"https://gemini.google.com/app",codex:"https://chatgpt.com/codex"};
const $=id=>document.getElementById(id);let state,activeCategory="All",query="",sortMode="relevance",toastTimer;
const uid=()=> "g_"+Math.random().toString(36).slice(2,10);
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const activeGroup=()=>state.groups.find(g=>g.id===state.activeGroup),promptById=id=>state.prompts.find(p=>p.id===id);
function defaults(){const g={id:"g_default",name:"新客户经营任务",title:"客户互动信息提炼",promptIds:[],context:"",language:"简体中文",detail:"专业详尽",guardrail:true};return{prompts:BUILTINS.slice(),groups:[g],activeGroup:g.id}}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
function load(){try{const x=JSON.parse(localStorage.getItem(STORAGE));if(!x||!Array.isArray(x.prompts)||!Array.isArray(x.groups))return defaults();const custom=x.prompts.filter(p=>!p.builtin);x.prompts=BUILTINS.concat(custom);x.groups.forEach(g=>g.promptIds=(g.promptIds||[]).filter(id=>x.prompts.some(p=>p.id===id)));if(!x.groups.length)return defaults();if(!x.groups.some(g=>g.id===x.activeGroup))x.activeGroup=x.groups[0].id;return x}catch{return defaults()}}
function notify(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2200)}
function catName(key){return key==="All"?"全部场景":C[key]||"自定义"}
function renderCategories(){const counts={};state.prompts.forEach(x=>counts[x.category]=(counts[x.category]||0)+1);$("category-count").textContent=state.prompts.length+" 项";$("category-list").innerHTML=CATEGORIES.map(([name,key])=>'<button class="category-item '+(activeCategory===key?"active":"")+'" data-cat="'+esc(key)+'"><span class="category-glyph">'+(key==="All"?"⌂":"◦")+'</span><span class="item-label">'+esc(name)+'</span><span class="item-count">'+(key==="All"?state.prompts.length:counts[key]||0)+'</span></button>').join("");$("category-list").querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;render()})}
function renderGroups(){const html=state.groups.map(g=>'<div class="group-row"><button class="group-item '+(g.id===state.activeGroup?"active":"")+'" data-group="'+esc(g.id)+'"><span class="group-icon">▤</span><span class="item-label">'+esc(g.name)+'</span><span class="item-count">'+g.promptIds.length+'</span></button><button class="delete-group" data-delete-group="'+esc(g.id)+'" title="删除提示词组" aria-label="删除提示词组">×</button></div>').join("");$("group-list").innerHTML=html;$("current-group-select").innerHTML=state.groups.map(g=>'<option value="'+esc(g.id)+'">'+esc(g.name)+'</option>').join("");$("current-group-select").value=state.activeGroup;$("group-list").querySelectorAll("[data-group]").forEach(b=>b.onclick=()=>switchGroup(b.dataset.group));$("group-list").querySelectorAll("[data-delete-group]").forEach(b=>b.onclick=e=>{e.stopPropagation();deleteGroup(b.dataset.deleteGroup)})}
function renderPrompts(){const g=activeGroup(),q=query.trim().toLocaleLowerCase();let items=state.prompts.filter(x=>(activeCategory==="All"||x.category===activeCategory)&&(!q||[x.name,x.description,x.category,x.tags.join(" "),x.body].join(" ").toLocaleLowerCase().includes(q)));if(sortMode==="name")items.sort((a,b)=>a.name.localeCompare(b.name,"zh-CN"));$("active-filter").textContent=(activeCategory==="All"?"全部提示词":catName(activeCategory))+(q?" · 搜索："+query:"");$("prompt-total").textContent=state.prompts.length+" PROMPTS";$("selection-count").textContent="已选 "+g.promptIds.length+" 条";$("empty-state").hidden=items.length>0;$("prompt-grid").hidden=items.length===0;$("prompt-grid").innerHTML=items.map(x=>{const selected=g.promptIds.includes(x.id);return'<article class="prompt-card '+(selected?"selected":"")+'" data-card="'+esc(x.id)+'"><div class="card-category">'+esc(catName(x.category))+(x.builtin?"":" · 自定义")+'</div><h3 class="card-title">'+esc(x.name)+'</h3><p class="card-description">'+esc(x.description)+'</p><div class="card-bottom"><div class="tag-list">'+x.tags.slice(0,3).map(t=>'<span class="tag">'+esc(t)+'</span>').join("")+'</div><div class="card-actions">'+(x.builtin?"":'<button class="card-action card-edit" data-edit="'+esc(x.id)+'" title="编辑提示词">✎</button>')+'<button class="card-action add" data-add="'+esc(x.id)+'">'+(selected?"已加入":"加入组")+' <span class="card-add-icon">'+(selected?"✓":"+ ")+'</span></button></div></div></article>'}).join("");$("prompt-grid").querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>togglePrompt(b.dataset.add));$("prompt-grid").querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openEditor(b.dataset.edit));renderComposer()}
function renderComposer(){const g=activeGroup();$("current-group-select").value=g.id;$("task-title").value=g.title||"";$("context-input").value=g.context||"";$("output-language").value=g.language||"简体中文";$("output-detail").value=g.detail||"专业详尽";$("guardrail-toggle").checked=g.guardrail!==false;$("module-count").textContent=g.promptIds.length;$("drop-hint").hidden=g.promptIds.length>0;$("selected-list").innerHTML=g.promptIds.map((id,i)=>{const x=promptById(id);return x?'<div class="selected-item" draggable="true" data-selected="'+esc(id)+'"><span class="drag-handle">⠿</span><span class="selected-name"><span class="selected-category">'+esc(catName(x.category))+'</span>'+esc(x.name)+'</span><button class="move-button" data-move="'+i+'" data-dir="-1" '+(i===0?"disabled":"")+' title="上移">↑</button><button class="move-button" data-move="'+i+'" data-dir="1" '+(i===g.promptIds.length-1?"disabled":"")+' title="下移">↓</button><button class="remove-button" data-remove="'+esc(id)+'" title="移除">×</button></div>':""}).join("");$("selected-list").querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>togglePrompt(b.dataset.remove,false));$("selected-list").querySelectorAll("[data-move]").forEach(b=>b.onclick=()=>movePrompt(+b.dataset.move,+b.dataset.dir));$("selected-list").querySelectorAll(".selected-item").forEach(el=>{el.ondragstart=e=>e.dataTransfer.setData("text/plain",el.dataset.selected);el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();const from=g.promptIds.indexOf(e.dataTransfer.getData("text/plain")),to=g.promptIds.indexOf(el.dataset.selected);if(from>=0&&to>=0){const [it]=g.promptIds.splice(from,1);g.promptIds.splice(to,0,it);save();renderPrompts()}}})}
function render(){renderCategories();renderGroups();renderPrompts()}
function persistFields(){const g=activeGroup();if(!g)return;g.title=$("task-title").value;g.context=$("context-input").value;g.language=$("output-language").value;g.detail=$("output-detail").value;g.guardrail=$("guardrail-toggle").checked;save()}
function switchGroup(id){persistFields();state.activeGroup=id;save();render()}
function togglePrompt(id,force){const ids=activeGroup().promptIds,has=ids.includes(id);if(force===true&&!has)ids.push(id);else if(force===false&&has)activeGroup().promptIds=ids.filter(x=>x!==id);else if(has)activeGroup().promptIds=ids.filter(x=>x!==id);else ids.push(id);save();renderPrompts();renderGroups()}
function movePrompt(i,d){const a=activeGroup().promptIds,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];save();renderPrompts()}
function createGroup(){const name=prompt("提示词组名称");if(!name||!name.trim())return;persistFields();const g={id:uid(),name:name.trim(),title:name.trim(),promptIds:[],context:"",language:"简体中文",detail:"专业详尽",guardrail:true};state.groups.push(g);state.activeGroup=g.id;save();render()}
function renameGroup(){const g=activeGroup(),n=prompt("修改提示词组名称",g.name);if(!n||!n.trim())return;g.name=n.trim();save();renderGroups()}
function deleteGroup(id){if(state.groups.length<2){notify("至少保留一个提示词组");return}const g=state.groups.find(x=>x.id===id);if(!g||!confirm("删除“"+g.name+"”提示词组？组内提示词不会从提示词库删除。"))return;state.groups=state.groups.filter(x=>x.id!==id);if(state.activeGroup===id)state.activeGroup=state.groups[0].id;save();render()}
function openEditor(id){const x=id?promptById(id):null;$("edit-prompt-id").value=id||"";$("prompt-dialog-title").textContent=x?"编辑提示词":"新建提示词";$("prompt-name").value=x?x.name:"";$("prompt-category").innerHTML=CATEGORIES.slice(1).map(c=>'<option value="'+esc(c[1])+'">'+esc(c[0])+'</option>').join("")+'<option value="custom">自定义</option>';$("prompt-category").value=x?x.category:"客户";$("prompt-tags").value=x?x.tags.join(", "):"";$("prompt-description").value=x?x.description:"";$("prompt-body").value=x?x.body:"";$("prompt-dialog").showModal()}
function savePrompt(e){e.preventDefault();const id=$("edit-prompt-id").value,x={id:id||uid(),category:$("prompt-category").value,name:$("prompt-name").value.trim(),description:$("prompt-description").value.trim(),tags:$("prompt-tags").value.split(",").map(s=>s.trim()).filter(Boolean),body:$("prompt-body").value.trim(),builtin:false};if(id){const i=state.prompts.findIndex(p=>p.id===id);state.prompts[i]=x}else state.prompts.push(x);save();$("prompt-dialog").close();render();notify(id?"提示词已更新":"提示词已新增")}
function assemble(){persistFields();const g=activeGroup(),mods=g.promptIds.map((id,i)=>{const x=promptById(id);return x?"## 模块 "+(i+1)+"："+x.name+"\n"+x.body:""}).filter(Boolean);const guard=g.guardrail?"\n\n## 准确性、隐私与合规要求\n- 只依据本指令和提供材料，不得虚构事实、数据、法律条款、产品条件、收益或审批结果。\n- 区分核实事实、材料陈述、推断、假设和建议；指出矛盾、缺失及不确定性。\n- 对个人信息、账户信息和交易明细采取最小化呈现；不需要时避免复述。\n- 涉及授信、投资、适当性、法律或合规判断时，提供分析和待核实事项，不替代授权人员决策。\n- 资料不足时说明缺口并提出澄清问题。":"";return"# "+(g.title||g.name)+"\n\n## 任务目标\n请依据下方任务模块，对提供的背景材料完成分析并按模块顺序执行。如模块冲突，先指出冲突并采用更审慎、可验证的处理方式。\n\n## 输出偏好\n- 语言："+g.language+"\n- 详细程度："+g.detail+"\n- 使用清晰标题、必要表格和可执行结论；保留计算口径和单位。"+guard+"\n\n## 任务背景与原始材料\n"+(g.context.trim()||"（尚未提供。请先询问我需要补充哪些材料，不要自行假设。）")+"\n\n## 选定的提示词模块\n"+(mods.length?mods.join("\n\n---\n\n"):"（尚未选择模块。请先询问任务目标及业务场景。）")+"\n\n## 最终交付要求\n先给执行摘要，再按模块逐项提供结果，最后列出假设、信息缺口、人工复核风险和下一步行动。不要重复整段原始材料。"}
function openPreview(){persistFields();$("final-prompt").value=assemble();$("preview-copy-button").dataset.open="false";$("preview-dialog").showModal()}
async function copyText(text){if(navigator.clipboard&&isSecureContext)return navigator.clipboard.writeText(text);const t=document.createElement("textarea");t.value=text;t.style.position="fixed";t.style.opacity="0";document.body.append(t);t.select();const ok=document.execCommand("copy");t.remove();if(!ok)throw Error("copy")}
async function copyFinal(){const open=$("preview-copy-button").dataset.open==="true",model=$("model-select").value;const target=open&&model!=="copy"?window.open(MODEL_URL[model],"_blank","noopener"):null;try{await copyText($("final-prompt").value);$("preview-dialog").close();notify(open&&model!=="copy"?"指令已复制并打开模型，请粘贴发送":"完整指令已复制")}catch{if(target)target.close();notify("复制失败，请在预览框中手动复制")}}
function exportBackup(){persistFields();const b=new Blob([JSON.stringify({version:1,data:state},null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="finance-prompt-desk-backup.json";a.click();URL.revokeObjectURL(a.href);notify("备份已导出")}
function importBackup(file){const r=new FileReader();r.onload=()=>{try{const raw=JSON.parse(r.result),d=raw.data||raw;if(!Array.isArray(d.groups)||!Array.isArray(d.prompts))throw Error();const prompts=BUILTINS.concat(d.prompts.filter(x=>!x.builtin));const ids=new Set(prompts.map(x=>x.id));d.groups.forEach(g=>g.promptIds=(g.promptIds||[]).filter(id=>ids.has(id)));state={...d,prompts};if(!state.groups.length)throw Error();if(!state.groups.some(g=>g.id===state.activeGroup))state.activeGroup=state.groups[0].id;save();render();notify("备份已导入")}catch{notify("备份格式无效")}};r.readAsText(file)}
function init(){state=load();render();$("search-input").oninput=e=>{query=e.target.value;renderPrompts()};$("sort-select").onchange=e=>{sortMode=e.target.value;renderPrompts()};$("new-group-button").onclick=createGroup;$("create-prompt-button").onclick=()=>openEditor();$("empty-create-button").onclick=()=>openEditor();$("prompt-form").onsubmit=savePrompt;$("current-group-select").onchange=e=>switchGroup(e.target.value);$("rename-group-button").onclick=renameGroup;$("task-title").oninput=persistFields;$("context-input").oninput=persistFields;$("output-language").onchange=persistFields;$("output-detail").onchange=persistFields;$("guardrail-toggle").onchange=persistFields;$("clear-selection-button").onclick=()=>{activeGroup().promptIds=[];save();renderPrompts();renderGroups()};$("preview-button").onclick=openPreview;$("generate-button").onclick=()=>{if(!activeGroup().promptIds.length){notify("请先从提示词库添加模块");return}openPreview();$("preview-copy-button").dataset.open="true"};$("copy-button").onclick=async()=>{if(!activeGroup().promptIds.length){notify("请先加入提示词");return}try{await copyText(assemble());notify("完整指令已复制")}catch{notify("复制失败，请使用预览窗口")}};$("preview-copy-button").onclick=e=>{e.preventDefault();copyFinal()};$("help-button").onclick=()=>$("help-dialog").showModal();$("collapse-composer").onclick=()=>{$("composer").classList.toggle("collapsed")};$("export-button").onclick=exportBackup;$("import-button").onclick=()=>$("import-file").click();$("import-file").onchange=e=>{if(e.target.files[0])importBackup(e.target.files[0]);e.target.value=""};document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("search-input").focus()}});if(!localStorage.getItem("financePromptDesk.seen")){setTimeout(()=>$("help-dialog").showModal(),350);localStorage.setItem("financePromptDesk.seen","1")}}
init();
