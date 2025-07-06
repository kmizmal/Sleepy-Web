# 🚀 快速开始

```bash
git clone https://github.com/sleepy-project/Sleepy-Web.git
cd Sleepy-Web
pnpm i
pnpm build
```

---

# ⚙️ 基础设置

参考 `.env.example` 创建 `.env` 文件，或自行添加必要的环境变量。

---

# 🔧 更多配置

## 📶 状态定义

文件路径：`src/assets/status.json`

```json
{
  "0": {
    "name": "活着",
    "color": "#2ecc71",
    "desc": "目前在线，可以通过任何可用的联系方式联系本人。"
  },
  "1": {
    "name": "似了",
    "color": "#656284",
    "desc": "睡似了或其他原因不在线，紧急情况请使用电话联系。"
  },
  "2": {
    "name": "透了",
    "color": "#ff4d4f",
    "desc": "可能是真的死了。"
  }

  // 可继续添加更多状态...
}
```

> 🔹 `color` 字段为十六进制颜色值，支持任何合法的 CSS 颜色（如 `#rrggbb`）。

---

## 🖼️ 设备图标映射

文件路径：`src/assets/icon-map.json`
图标来源：[Remix Icon 图标库](https://remixicon.com)

> 访问官网，挑选图标并复制其类名，填入如下格式：

```json
{
  "MacBookPro": "fas fa-laptop",
  "iPhone15": "fas fa-mobile-alt",
  "iPad": "fas fa-tablet-alt",
  "NASServer": "fas fa-server",
  "SmartWatch": "fas fa-clock",
  "DesktopPC": "fas fa-desktop",
  "SmartTV": "fas fa-tv"

  // 自定义图标功能开发中...
}
```