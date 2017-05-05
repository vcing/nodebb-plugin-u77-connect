<div class="row">
    <div class="category col-lg-12 col-sm-12" has-widget-class="category col-lg-9 col-sm-12" has-widget-target="sidebar">
        <div class="subcategory">
            <!-- IF children.length -->
            <p>{name}</p>
            <!-- ENDIF children.length -->

            <ul class="categories" itemscope itemtype="http://www.schema.org/ItemList">
                <!-- BEGIN children -->
                <li component="categories/category" data-cid="{../cid}" data-numRecentReplies="1" class="row clearfix">
                    <meta itemprop="name" content="{../name}">

                    <div class="content col-xs-12 <!-- IF config.hideCategoryLastPost -->col-md-10 col-sm-12<!-- ELSE -->col-md-7 col-sm-9<!-- ENDIF config.hideCategoryLastPost -->">
                        <div class="icon pull-left" style="{function.generateCategoryBackground}">
                            <i class="fa fa-fw {../icon}"></i>
                        </div>

                        <h2 class="title">
                            <!-- IF ../link -->
                            <a href="{../link}" itemprop="url" target="_blank">
                                <!-- ELSE -->
                                <a href="{config.relative_path}/category/{../slug}" itemprop="url">
                                    <!-- ENDIF ../link -->
                                    {../name}
                                </a><br/>
                                <!-- IF ../descriptionParsed -->
                                <div class="description">
                                    {../descriptionParsed}
                                </div>
                                <!-- ENDIF ../descriptionParsed -->
                                <!-- IF !config.hideSubCategories -->
                                {function.generateChildrenCategories}
                                <!-- ENDIF !config.hideSubCategories -->
                        </h2>
                        <span class="visible-xs pull-right">
			<!-- IF ../teaser.timestampISO -->
			<a class="permalink" href="{../teaser.url}">
				<small class="timeago" title="{../teaser.timestampISO}"></small>
			</a>
			<!-- ENDIF ../teaser.timestampISO -->
		</span>
                    </div>

                    <!-- IF !../link -->
                    <div class="col-md-1 hidden-sm hidden-xs stats">
                        <span class="{../unread-class} human-readable-number" title="{../totalTopicCount}">{../totalTopicCount}</span><br />
                        <small>[[global:topics]]</small>
                    </div>
                    <div class="col-md-1 hidden-sm hidden-xs stats">
                        <span class="{../unread-class} human-readable-number" title="{../totalPostCount}">{../totalPostCount}</span><br />
                        <small>[[global:posts]]</small>
                    </div>
                    <!-- IF !config.hideCategoryLastPost -->
                    <div class="col-md-3 col-sm-3 teaser hidden-xs" component="topic/teaser">
                        <div class="card" style="border-color: {../bgColor}">
                            <!-- BEGIN posts -->
                            <!-- IF @first -->
                            <div component="category/posts">
                                <p>
                                    <a href="{config.relative_path}/user/{../user.userslug}">
                                        <!-- IF ../user.picture -->
                                        <img class="user-img" title="{../user.username}" alt="{../user.username}" src="{../user.picture}" title="{../user.username}" />
                                        <!-- ELSE -->
                                        <span class="user-icon user-img" title="{../user.username}" style="background-color: {../user.icon:bgColor};">{../user.icon:text}</span>
                                        <!-- ENDIF ../user.picture -->
                                    </a>
                                    <a class="permalink" href="{config.relative_path}/topic/{../topic.slug}<!-- IF ../index -->/{../index}<!-- ENDIF ../index -->">
                                        <small class="timeago" title="{../timestampISO}"></small>
                                    </a>
                                </p>
                                <div class="post-content">
                                    {../content}
                                </div>
                            </div>
                            <!-- ENDIF @first -->
                            <!-- END posts -->

                            <!-- IF !../posts.length -->
                            <div component="category/posts">
                                <div class="post-content">
                                    [[category:no_new_posts]]
                                </div>
                            </div>
                            <!-- ENDIF !../posts.length -->
                        </div>
                    </div>
                    <!-- ENDIF !config.hideCategoryLastPost -->
                    <!-- ENDIF !../link -->
                </li>

                <!-- END children -->
            </ul>
        </div>

        <!-- IF config.usePagination -->
        <div component="pagination" class="text-center pagination-container<!-- IF !pagination.pages.length --> hidden<!-- ENDIF !pagination.pages.length -->">
            <ul class="pagination hidden-xs">
                <li class="previous pull-left<!-- IF !pagination.prev.active --> disabled<!-- ENDIF !pagination.prev.active -->">
                    <a href="?{pagination.prev.qs}" data-page="{pagination.prev.page}"><i class="fa fa-chevron-left"></i> </a>
                </li>

                <!-- BEGIN pages -->
                <!-- IF pagination.pages.separator -->
                <li component="pagination/select-page" class="page select-page">
                    <a href="#"><i class="fa fa-ellipsis-h"></i></a>
                </li>
                <!-- ELSE -->
                <li class="page<!-- IF pagination.pages.active --> active<!-- ENDIF pagination.pages.active -->">
                    <a href="?{pagination.pages.qs}" data-page="{pagination.pages.page}">{pagination.pages.page}</a>
                </li>
                <!-- ENDIF pagination.pages.separator -->
                <!-- END pages -->

                <li class="next pull-right<!-- IF !pagination.next.active --> disabled<!-- ENDIF !pagination.next.active -->">
                    <a href="?{pagination.next.qs}" data-page="{pagination.next.page}"> <i class="fa fa-chevron-right"></i></a>
                </li>
            </ul>

            <ul class="pagination hidden-sm hidden-md hidden-lg">
                <li class="first<!-- IF !pagination.prev.active --> disabled<!-- ENDIF !pagination.prev.active -->">
                    <a href="?page=1" data-page="1"><i class="fa fa-fast-backward"></i> </a>
                </li>

                <li class="previous<!-- IF !pagination.prev.active --> disabled<!-- ENDIF !pagination.prev.active -->">
                    <a href="?{pagination.prev.qs}" data-page="{pagination.prev.page}"><i class="fa fa-chevron-left"></i> </a>
                </li>

                <li component="pagination/select-page" class="page select-page">
                    <a href="#">{pagination.currentPage} / {pagination.pageCount}</a>
                </li>

                <li class="next<!-- IF !pagination.next.active --> disabled<!-- ENDIF !pagination.next.active -->">
                    <a href="?{pagination.next.qs}" data-page="{pagination.next.page}"> <i class="fa fa-chevron-right"></i></a>
                </li>

                <li class="last<!-- IF !pagination.next.active --> disabled<!-- ENDIF !pagination.next.active -->">
                    <a href="?page={pagination.pageCount}" data-page="{pagination.pageCount}"><i class="fa fa-fast-forward"></i> </a>
                </li>
            </ul>
        </div>
        <!-- ENDIF config.usePagination -->
    </div>
</div>