import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	UmamiConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "YunYe Blog",
	subtitle: "博客",
	lang: "zh_CN", // 语言代码，例如 'en', 'zh-CN', 'ja' 等。
	themeColor: {
		hue: 250, // 主题色的默认色相，范围 0 到 360。例如红色: 0，青色: 200，蓝色: 250，粉色: 345
		fixed: true, // 隐藏访客的主题色选择器
	},
	banner: {
		enable: true,
		src: "assets/images/demo-banner.webp", // 相对于 /src 目录。如果以 '/' 开头则相对于 /public 目录。
		position: "center", // 等同于 object-position，仅支持 'top', 'center', 'bottom'。默认为 'center'
		credit: {
			enable: true, // 是否显示横幅图片的版权信息
			text: "空色天絵 / NEO TOKYO NOIR 01", // 要显示的版权文本
			url: "https://www.pixiv.net/artworks/111024784", // （可选）指向原始作品或艺术家页面的链接
		},
	},
	toc: {
		enable: true, // 在文章右侧显示目录
		depth: 2, // 目录显示的最大标题层级，范围 1 到 3
	},
	favicon: [
		// 留空则使用默认 favicon
		// {
		//   src: '/favicon/icon.png',    // favicon 路径，相对于 /public 目录
		//   theme: 'light',              // （可选）'light' 或 'dark'，仅在有不同模式的 favicon 时设置
		//   sizes: '32x32',              // （可选）favicon 的尺寸，仅在有不同尺寸时设置
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "友链",
			url: "/friends/", // Internal links should not include the base path, as it is automatically added
			external: false, // Show an external link icon and will open in a new tab
		},
		LinkPreset.About,
		{
			name: "网站状态",
			url: "https://wqpmomdj.ap-northeast-1.clawcloudrun.com", // 内部链接不需要包含基础路径，会自动添加
			external: true, // 显示外链图标并在新标签页打开
		},
		
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/demo-avatar.png", // 相对于 /src 目录。如果以 '/' 开头则相对于 /public 目录。
	name: "Yun Ye",
	bio: "欢迎来到云烨的主页！",
	links: [
		{
			name: "QQ",
			icon: "mdi:qqchat", // 图标代码可访问 https://icones.js.org/
			// 如果未包含对应图标集，需要安装
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=3105319877&website=www.oicqzone.com",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/OneBird2018/",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const umamiConfig: UmamiConfig = {
	enable: true,
	baseUrl: "https://cloud.umami.is/analytics/us",
	shareId: "XKsfIpyqaISjA04A",
	timezone: "Asia/Shanghai",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：部分样式（如背景色）已被覆盖，详见 astro.config.mjs 文件。
	// 请务必选择深色主题，因为本博客主题目前仅支持深色背景。
	theme: "github-dark",
};
