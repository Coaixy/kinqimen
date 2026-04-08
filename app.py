import math
import urllib.request
import streamlit as st
import pendulum as pdlm
import datetime, pytz
from io import StringIO
from contextlib import contextmanager, redirect_stdout

import kinqimen
from kinliuren import kinliuren
import config

# ------------------- 工具 -------------------
@contextmanager
def st_capture(output_func):
    with StringIO() as stdout, redirect_stdout(stdout):
        old_write = stdout.write
        def new_write(string):
            ret = old_write(string)
            output_func(stdout.getvalue())
            return ret
        stdout.write = new_write
        yield

def fetch_md(file):
    url = f'https://raw.githubusercontent.com/kentang2017/kinliuren/master/{file}'
    return urllib.request.urlopen(url).read().decode("utf-8")

# ------------------- 頁面設定 -------------------
st.set_page_config(page_title="堅奇門 - 奇門排盤", page_icon="🧮", layout="wide")
pan, example, guji, log, links = st.tabs(['🧮 排盤', '📜 案例', '📚 古籍', '🆕 更新', '🔗 連結'])

with links:
    st.markdown(fetch_md("update.md"), unsafe_allow_html=True)
with log:
    st.markdown(fetch_md("log.md"), unsafe_allow_html=True)

# ------------------- 側邊欄 -------------------
with st.sidebar:
    pp_date = st.date_input("日期", pdlm.now(tz='Asia/Shanghai').date())
    pp_time = st.text_input('時間 (如 18:30)', '')
    method = st.selectbox('起盤方式', ('時家奇門', '刻家奇門'))
    paipan = st.selectbox('排盤方式', ('置閏', '拆補'))
    manual = st.button('手動起盤')
    instant = st.button('即時起盤')

    is_shijia = method == '時家奇門'
    pai = 2 if paipan == '置閏' else 1   # 1=拆補 2=置閏

# ------------------- 共用函數 -------------------
eg = list("巽離坤震兌艮坎乾")

# ------------------- 閉六戊法 SVG 產生器 -------------------
_LIUYI_TO_XUN = {
    "戊": "甲子", "己": "甲戌", "庚": "甲申",
    "辛": "甲午", "壬": "甲辰", "癸": "甲寅",
}
_SIXWU_POS = {
    "甲子": "辰", "甲戌": "寅", "甲申": "子",
    "甲午": "戌", "甲辰": "申", "甲寅": "午",
}

def generate_closed_sixwu_svg(xun_head: str, version: str = "演義版") -> str:
    """回傳完整的 SVG 字串 for 真人閉六戊法圓形十二地支圈。

    Args:
        xun_head: 當前旬首，如 "甲子"、"甲戌" 等六個甲XX旬之一。
        version: "演義版" 為逆布連土；"寶鑑版" 為順布連土。

    Returns:
        完整的 SVG XML 字串，可直接嵌入 HTML / st.markdown。
    """
    wu_branch = _SIXWU_POS.get(xun_head, "子")

    dizhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    yang_set = {"子", "寅", "辰", "午", "申", "戌"}
    yang_cw = ["子", "寅", "辰", "午", "申", "戌"]  # 六陽支順時針排序

    cx, cy, r, node_r = 250, 250, 175, 22

    positions = {}
    for i, dz in enumerate(dizhi):
        angle = math.radians(i * 30)
        positions[dz] = (cx + r * math.sin(angle), cy - r * math.cos(angle))

    start_idx = yang_cw.index(wu_branch)
    if version == "演義版":
        path_order = [yang_cw[(start_idx - i) % 6] for i in range(7)]
    else:
        path_order = [yang_cw[(start_idx + i) % 6] for i in range(7)]

    def shorten(x1, y1, x2, y2, m=node_r + 6):
        """Shorten a segment by margin m from both ends to avoid overlapping nodes."""
        dx, dy = x2 - x1, y2 - y1
        d = math.sqrt(dx * dx + dy * dy)
        if d == 0:
            return x1, y1, x2, y2
        return x1 + dx / d * m, y1 + dy / d * m, x2 - dx / d * m, y2 - dy / d * m

    arrows = []
    for i in range(6):
        p1 = positions[path_order[i]]
        p2 = positions[path_order[i + 1]]
        x1, y1, x2, y2 = shorten(*p1, *p2)
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        dx, dy = x2 - x1, y2 - y1
        d = math.sqrt(dx * dx + dy * dy)
        nx, ny = (-dy / d * 13, dx / d * 13) if d > 0 else (0, 0)
        arrows.append(
            f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke="#CC3300" stroke-width="3.5" marker-end="url(#arw)" opacity="0.82"/>'
            f'<circle cx="{mx + nx:.1f}" cy="{my + ny:.1f}" r="10" fill="#CC3300" opacity="0.85"/>'
            f'<text x="{mx + nx:.1f}" y="{my + ny + 4.5:.1f}" text-anchor="middle" '
            f'font-size="11" fill="white" font-weight="bold">{i + 1}</text>'
        )

    nodes = []
    for dz in dizhi:
        x, y = positions[dz]
        is_wu = dz == wu_branch
        is_yang = dz in yang_set

        if is_wu:
            fill, stroke, sw = "#FFD700", "#CC0000", 3.5
            tf, fw, fs = "#CC0000", "bold", 18
        elif is_yang:
            fill, stroke, sw = "#DCF0FF", "#3A7CC7", 2.0
            tf, fw, fs = "#1A4A8A", "bold", 18
        else:
            fill, stroke, sw = "#F0F0F0", "#888888", 1.5
            tf, fw, fs = "#555555", "normal", 16

        nodes.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{node_r}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="{sw}"/>'
        )
        nodes.append(
            f'<text x="{x:.1f}" y="{y + 6:.1f}" text-anchor="middle" font-size="{fs}" '
            f'fill="{tf}" font-family="serif" font-weight="{fw}">{dz}</text>'
        )

        if is_wu:
            ax = math.atan2(x - cx, -(y - cy))
            ox = cx + (r + node_r + 22) * math.sin(ax)
            oy = cy - (r + node_r + 22) * math.cos(ax)
            nodes.append(
                f'<circle cx="{ox:.1f}" cy="{oy:.1f}" r="16" fill="#CC0000" opacity="0.92"/>'
                f'<text x="{ox:.1f}" y="{oy + 6:.1f}" text-anchor="middle" font-size="19" '
                f'fill="white" font-weight="bold" font-family="serif">戊</text>'
            )

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" '
        f'width="420" height="420" style="display:block;margin:0 auto">'
        f'<defs>'
        f'<marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" '
        f'markerWidth="6" markerHeight="6" orient="auto">'
        f'<path d="M0 0 L10 5 L0 10 z" fill="#CC3300"/>'
        f'</marker>'
        f'<radialGradient id="bgg" cx="50%" cy="50%" r="50%">'
        f'<stop offset="0%" style="stop-color:#FFFDF0"/>'
        f'<stop offset="100%" style="stop-color:#FFF0C8"/>'
        f'</radialGradient>'
        f'</defs>'
        f'<rect width="500" height="500" fill="url(#bgg)" rx="14"/>'
        f'<circle cx="{cx}" cy="{cy}" r="218" fill="none" stroke="#8B6914" '
        f'stroke-width="2.5" opacity="0.35"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#C4A44A" '
        f'stroke-width="1.5" stroke-dasharray="5 4" opacity="0.5"/>'
        f'<circle cx="{cx}" cy="{cy}" r="44" fill="#FFFBF0" stroke="#8B6914" '
        f'stroke-width="1.5" opacity="0.7"/>'
        f'<text x="{cx}" y="{cy - 5}" text-anchor="middle" font-size="14" '
        f'fill="#6B4C11" font-family="serif">六戊</text>'
        f'<text x="{cx}" y="{cy + 13}" text-anchor="middle" font-size="14" '
        f'fill="#6B4C11" font-family="serif">連土</text>'
        f'<text x="{cx}" y="28" text-anchor="middle" font-size="15" fill="#5C3317" '
        f'font-family="serif" font-weight="bold">'
        f'{xun_head}旬・戊在{wu_branch}・{version}</text>'
        f'{"".join(arrows)}'
        f'{"".join(nodes)}'
        f'</svg>'
    )

def render_pan(y, m, d, h, minute, is_shijia=True):
    gz = config.gangzhi(y, m, d, h, minute)
    jq = config.jq(y, m, d, h,minute)
    lunar_mon = dict(zip(range(1,13), config.cmonth)).get(config.lunar_date_d(y,m,d)["月"])

    if is_shijia:
        q = kinqimen.Qimen(y, m, d, h, minute).pan(pai)
        lr = kinliuren.Liuren(q["節氣"], lunar_mon, gz[2], gz[3]).result(0)
    else:
        q = kinqimen.Qimen(y, m, d, h, minute).pan_minute(pai)
        lr = kinliuren.Liuren(q["節氣"], lunar_mon, gz[3], gz[4]).result(0)

    # 提取資料
    qd = [q["地盤"][k] for k in eg]
    qt = [q.get("天盤", {}).get(k, "") for k in eg]
    god = [q["神"][k] for k in eg]
    door = [q["門"][k] for k in eg]
    star = [q["星"][k] for k in eg]
    mid = q["地盤"]["中"]
    es, egod = lr["地轉天盤"], lr["地轉天將"]
    zf_xing = q["值符值使"]["值符星宮"][1]
    zm_men  = q["值符值使"]["值使門宮"][0]
    zm_gong = q["值符值使"]["值使門宮"][1]
    # 輸出文字盤面
    print(f"{'時家奇門' if is_shijia else '刻家奇門'} | {q['排盤方式']}")
    print(f"{y}年{m}月{d}日 {h}時{minute}分\n")
    print(f"{q['干支']} | {q['排局']} | 節氣：{jq}")
    print(f"值符星宮：天{zf_xing}宮　　值使門宮：{zm_men}門{zm_gong}宮")
    print(f"農曆月：{config.lunar_date_d(y,m,d)['農曆月']}  |  "
          f"距節氣：{config.qimen_ju_name_zhirun_raw(y,m,d,h,minute)['距節氣差日數']}天\n")

    # 九宮格 ASCII 藝術（共用）
    lines = [
        f"＼  {es['巳']}{egod['巳']}  　 │  {es['午']}{egod['午']}　 │  {es['未']}{egod['未']}　 │  　 {es['申']}{egod['申']}　 ／",
        " ＼─────────┴──┬─────┴─────┬──┴──────────／",
        f" 　│　　{god[0]}　　　 │　　{god[1]}　　　 │　　{god[2]}　　　 │",
        f" 　│　　{door[0]}　　{qt[0]} │　　{door[1]}　　{qt[1]} │　　{door[2]}　　{qt[2]} │",
        f" 　│　　{star[0]}　　{qd[0]} │　　{star[1]}　　{qd[1]} │　　{star[2]}　　{qd[2]} │",
        f" {es['辰']}├───────────┼───────────┼───────────┤{es['酉']}",
        f" {egod['辰']}│　　{god[3]}　　　 │　　　　　　 │　　{god[4]}　　　 │{egod['酉']}",
        f"　─┤　　{door[3]}　　{qt[3]} │　　　　　　 │　　{door[4]}　　{qt[4]} ├─",
        f" 　│　　{star[3]}　　{qd[3]} │　　　　　{mid} │　　{star[4]}　　{qd[4]} │",
        " 　├───────────┼───────────┼───────────┤",
        f"　 │　　{god[5]}　　　 │　　{god[6]}　　　 │　　{god[7]}　　　 │",
        f" {es['卯']}│　　{door[5]}　　{qt[5]} │　　{door[6]}　　{qt[6]} │　　{door[7]}　　{qt[7]} │{es['戌']}",
        f" {egod['卯']}│　　{star[5]}　　{qd[5]} │　　{star[6]}　　{qd[6]} │　　{star[7]}　　{qd[7]} │{egod['戌']}",
        " ／─────────┬──┴─────┬─────┴──┬────────＼",
        f"／  {es['寅']}{egod['寅']}  　 │  {es['丑']}{egod['丑']}　 │  {es['子']}{egod['子']}　 │  　 {es['亥']}{egod['亥']}　 ＼",
    ]
    for line in lines:
        print(line)

    st.expander("原始資料").write(q)

    # ------------------- 閉六戊法 expander -------------------
    xun_head_jiazi = _LIUYI_TO_XUN.get(q.get("旬首", ""), "甲子")
    wu_branch = _SIXWU_POS.get(xun_head_jiazi, "子")
    yang_cw = ["子", "寅", "辰", "午", "申", "戌"]
    start_idx = yang_cw.index(wu_branch)

    with st.expander("🔒 真人閉六戊法（法術奇門） - 十二地支圈 SVG 視覺化"):
        version_choice = st.radio(
            "選擇版本",
            ["演義版（逆布連土）", "寶鑑版（順布連土）"],
            horizontal=True,
            key="sixwu_version",
        )
        v = "演義版" if "演義版" in version_choice else "寶鑑版"

        svg_str = generate_closed_sixwu_svg(xun_head_jiazi, v)
        st.markdown(
            f'<div style="text-align:center;padding:12px 0">{svg_str}</div>',
            unsafe_allow_html=True,
        )

        if v == "演義版":
            path_order = [yang_cw[(start_idx - i) % 6] for i in range(7)]
            direction_text = "逆布（逆時針依六陽支）"
        else:
            path_order = [yang_cw[(start_idx + i) % 6] for i in range(7)]
            direction_text = "順布（順時針依六陽支）"

        path_text = "→".join(path_order[:6]) + f" → 回{path_order[0]}"

        st.markdown(f"""**📌 本旬六戊位置**：{xun_head_jiazi}旬，戊藏於 **{wu_branch}** 位

**🗺️ 連土路徑（{v} · {direction_text}）**  
{path_text}

---
**🪜 畫地儀式步驟**  
1. **起筆**：由鬼門（艮宮，東北方）起筆，以{path_order[0]}位為起點  
2. **禹步**：{"逆時針" if v == "演義版" else "順時針"}踏行，依序於六陽支（{" → ".join(path_order[:6])}）各落土一撮  
3. **天門留空**：乾宮（西北方）留「天門」不封，以納天氣  
4. **收筆**：回踏{path_order[0]}位，封閉六戊圈

---
**📿 共同主咒**
> 泰山之陽，黃河之陰，天有雷神，地有鬼兵，  
> 六戊封土，萬邪退散，護我{xun_head_jiazi}旬清淨之地，  
> 急急如九天玄女元君律令敕！

---
**⚠️ 注意事項**  
- 翌日必於乾門（西北方）開土散土，勿忘解封  
- 施法期間，施法者不可從乾門（西北）出入，否則法效消散  
- 若無法翌日解封，三日內必解，否則反傷自身
""")


# 顯示原始 dict

# ------------------- 主畫面 -------------------
with pan:
    st.header('堅奇門排盤')

    output = st.empty()
    with st_capture(output.code):
        # 即時盤（預設）
        if instant or (not manual and not instant):  # 頁面初載也顯示即時
            now = datetime.datetime.now(pytz.timezone('Asia/Hong_Kong'))
            render_pan(now.year, now.month, now.day, now.hour, now.minute, is_shijia=True)

        # 手動盤
        if manual and pp_time:
            try:
                h, mnt = map(int, pp_time.split(':'))
                render_pan(pp_date.year, pp_date.month, pp_date.day, h, mnt, is_shijia)
            except:
                st.error("時間格式錯誤，請輸入如 18:30")






